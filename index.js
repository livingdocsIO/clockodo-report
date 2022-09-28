#!/usr/bin/env node
const fs = require('fs')
const {parse} = require('csv-parse')
const _ = require('lodash')
const rows = []
const cleanDescription = function (description) {
    const wcmsMatch = description.match(/(WCMS-\d+)/)
    const chmediaMatch = description.match(/(CHMEDIA-\d+)/)
    if (wcmsMatch) return wcmsMatch[0]
    if (chmediaMatch) return chmediaMatch[0]
    return description
}

const parser = parse({columns: true}, function (err, records) {
    for (const record of records) {
        rows.push({
            project: record.Projekt,
            description: record.Beschreibung,
            time: record.Menge,
            type: record['Leistung/Pauschalleistung']
        })
    }
    /* Budgetüberwachung */
    const byProjectWithMeetings = _.reduce(rows, (acc, row) => {
        const project = row.project
        if (!acc[project]) acc[project] = {rows: []}
        acc[project].rows.push(row)
        return acc
    }, {})

    console.log("=================")
    console.log("Budgetüberwachung")
    console.log("=================")
    for (const key in byProjectWithMeetings) {
        const projectRows = byProjectWithMeetings[key].rows
        const sum = _.sumBy(projectRows, (r) => Number(r.time))
        console.log(key, ': ', sum)
    }



    /* Reports */
    // take out meeting (this is different from budgetüberwachung)
    const meetings = _.remove(rows, (r) => r.type === 'Meeting')
    const byProject = _.reduce(rows, (acc, row) => {
        const project = row.project
        if (!acc[project]) acc[project] = {rows: []}
        acc[project].rows.push(row)
        return acc
    }, {})
    
    // accumulate times over descriptions
    for (const key in byProject) {
        const projectRows = byProject[key].rows
        const accumulatedTimes = _.reduce(projectRows, (acc, row) => {
            const description = cleanDescription(row.description)
            if (!acc[description]) acc[description] = 0
            acc[description] += Number(row.time)
            return acc
        }, {})
        byProject[key].accumulatedTimes = accumulatedTimes
    }
    
    console.log("=================")
    console.log("Reporting")
    console.log("=================")
    // write files
    for (const key in byProject) {
        const accumulatedTimes = byProject[key].accumulatedTimes
        accumulatedTimes
        const csvContent = Object.keys(accumulatedTimes).sort().map(e => `${e},${accumulatedTimes[e]}`).join('\n')
        // const csvContent = `data:text/csv;charset=utf-8,${rowContent}`
        fs.writeFileSync(`${_.camelCase(key)}.csv`, csvContent);
        console.log('Successfully wrote file', `${_.camelCase(key)}.csv`)
    }

    // log meeting times
    console.log('Meetings:', _.sumBy(meetings, (m) => Number(m.time)))

})

fs.createReadStream(__dirname+'/input.csv').pipe(parser)