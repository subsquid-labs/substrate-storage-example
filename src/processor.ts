import {BatchContext, BatchProcessorItem, SubstrateBatchProcessor, SubstrateBlock} from '@subsquid/substrate-processor'
import {lookupArchive} from '@subsquid/archive-registry'

export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        archive: lookupArchive('polkadot', {release: 'FireSquid'}),
        chain: 'wss://rpc.polkadot.io',
    })
    .addEvent('Grandpa.NewAuthorities', {
        data: {
            event: {
                args: true,
            },
        },
    } as const)

export type Item = BatchProcessorItem<typeof processor>
export type ProcessorContext<Store> = BatchContext<Store, Item>
