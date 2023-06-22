import {SubstrateBlock} from '@subsquid/substrate-processor'
import {Store, TypeormDatabase} from '@subsquid/typeorm-store'
import {Era, EraNomination, EraValidator} from './model'
import {ProcessorContext, processor} from './processor'
import {SessionValidatorsStorage, StakingActiveEraStorage, StakingErasStakersStorage} from './types/storage'
import * as ss58 from '@subsquid/ss58'

processor.run(new TypeormDatabase(), async (ctx) => {
    for (let {header: block, items} of ctx.blocks) {
        let eras: Era[] = []
        let eraValidators: EraValidator[] = []
        let eraNominations: EraNomination[] = []

        for (let item of items) {
            if (item.name == 'Grandpa.NewAuthorities') {
                let eraInfo = await getActiveEraInfo(ctx, block)

                if (!eraInfo || (eraInfo.start ?? -1) != block.timestamp) continue

                ctx.log.info(`processing era ${eraInfo?.index}...`)

                let era = new Era({
                    id: eraInfo?.index.toString(),
                    index: eraInfo.index,
                    startedAt: block.height,
                })
                eras.push(era)

                let validatorIds = await getEraValidators(ctx, block)
                if (!validatorIds) validatorIds = []

                let validatorsInfo = await getEraValidatorsInfo(ctx, block, era.index, validatorIds)
                if (!validatorsInfo) validatorsInfo = []

                for (let i = 0; i < validatorIds.length; i++) {
                    let validatorId = encodeId(validatorIds[i])
                    let validatorInfo = validatorsInfo[i]

                    let validator = new EraValidator({
                        id: `${era.index}-${validatorId}`,
                        era,
                        validatorId,
                        selfBonded: validatorInfo.own,
                        totalBonded: validatorInfo.total,
                        nominatorsCount: validatorInfo.others.length,
                    })
                    eraValidators.push(validator)

                    for (let nomination of validatorInfo.others) {
                        let nominatorId = encodeId(nomination.who)

                        eraNominations.push(
                            new EraNomination({
                                id: `${validator.id}-${nominatorId}`,
                                era,
                                validator,
                                nominatorId,
                                amount: nomination.value,
                            })
                        )
                    }
                }
            }
        }
        await ctx.store.insert(eras)
        await ctx.store.insert(eraValidators)
        await ctx.store.insert(eraNominations)
    }
})

async function getActiveEraInfo(ctx: ProcessorContext<Store>, block: SubstrateBlock) {
    const s = new StakingActiveEraStorage(ctx, block)

    if (!s.isExists) {
        return undefined
    } else if (s.isV0) {
        return s.getAsV0()
    } else {
        throw new UknownVersionError()
    }
}

async function getEraValidators(ctx: ProcessorContext<Store>, block: SubstrateBlock) {
    const s = new SessionValidatorsStorage(ctx, block)

    if (!s.isExists) {
        return undefined
    } else if (s.isV0) {
        return s.getAsV0()
    } else {
        throw new UknownVersionError()
    }
}

async function getEraValidatorsInfo(
    ctx: ProcessorContext<Store>,
    block: SubstrateBlock,
    eraIndex: number,
    validatorIds: Uint8Array[]
) {
    const s = new StakingErasStakersStorage(ctx, block)

    if (!s.isExists) {
        return undefined
    } else if (s.isV0) {
        return s.getManyAsV0(validatorIds.map((v) => [eraIndex, v]))
    } else {
        throw new UknownVersionError()
    }
}

function encodeId(id: Uint8Array): string {
    return ss58.codec('polkadot').encode(id)
}

class UknownVersionError extends Error {
    constructor() {
        super('Uknown verson')
    }
}
