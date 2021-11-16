import { Replica } from '@bryntum/chronograph/src/replica/Replica'
import { Entity, field, calculate } from "@bryntum/chronograph/src/replica/Entity"
import { Base } from '@bryntum/chronograph/src/class/Base'
import * as express from 'express'
import { Application } from "express"
import { Identifier } from '@bryntum/chronograph/src/chrono/Identifier'
import { SyncEffectHandler } from '@bryntum/chronograph/src/chrono/Transaction'
import { ChronoGraph } from '@bryntum/chronograph/src/chrono/Graph'

const app: Application = express()
const port = 3000

const replica = Replica.new()

class Person extends Entity.mix(Base) {
    @field()
    firstName: string

    @field()
    lastName: string

    @calculate('fullName')
    calculateFullName (): string {
        return this.firstName + ' ' + this.lastName
    }
}


app.get('/person', (req, res) => {
    const person = Person.new({firstName: "vano", lastName: "atabegashvili"})
    replica.addEntity(person)
    res.json(person.calculateFullName())
})

app.get('/', (req, res) => {
    const identifier1 = Identifier.new({calculation: () => 42})

    const identifier2 = Identifier.new({
        calculation: (Y: SyncEffectHandler) => {
            const v1: number = Y(identifier1)
            return v1 + 5
        }
    })

    const graph = ChronoGraph.new()

    graph.addIdentifier(identifier1)

    const value1 = graph.read(identifier1)
    res.json(value1)
})

app.listen(port, () => console.log(`Listening on port ${port}`))
