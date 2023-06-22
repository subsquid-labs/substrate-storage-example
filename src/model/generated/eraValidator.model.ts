import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Era} from "./era.model"
import {EraNomination} from "./eraNomination.model"

@Entity_()
export class EraValidator {
    constructor(props?: Partial<EraValidator>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Era, {nullable: true})
    era!: Era

    @Column_("text", {nullable: false})
    validatorId!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    selfBonded!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalBonded!: bigint

    @Column_("int4", {nullable: false})
    nominatorsCount!: number

    @OneToMany_(() => EraNomination, e => e.validator)
    nominators!: EraNomination[]
}
