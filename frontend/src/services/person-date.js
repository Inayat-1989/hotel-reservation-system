export let personList = []

export const findPerson = (email) => {
    const person = personList.find((person) => person.email === email)
    return person
}

export const findPersonIndex = (email) => {
    const personIndex = personList.findIndex((person) => person.email === email)
    return personIndex
}

export const addPersonToList = (personData) => {
    const person = findPerson(personData.email)
    if(person) {
        return
    }
    personList.push(personData)
}

export const removePersonFromList = (personData) => {
    const personIndex = findPersonIndex(personData.email)
    if(personIndex) {
        personList.splice(personIndex, 1)
    }
}