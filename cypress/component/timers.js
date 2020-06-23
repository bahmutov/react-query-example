/// <reference types="cypress" />
const React = require('react')
const { useQuery, queryCache } = require('react-query')
const {mount}= require('cypress-react-unit-test')

beforeEach(() => queryCache.clear())

it('renders data after real 300ms', () => {
  function Example() {
    const {data} = useQuery({
      queryKey: 'some-key',
      queryFn: () => {
        return new Promise((r) => setTimeout(() => {
          return r('data')
        }, 300))
      },
    })
    return data || 'no data yet'
  }

  mount(<Example />)
  cy.contains('no data yet')
  // and the it shows "data"
  cy.contains(/^data$/)
})

it('renders data after mock clock delay', () => {
  // notice 3000ms delay
  function Example() {
    const {data} = useQuery({
      queryKey: 'some-key',
      queryFn: () => {
        console.log('queryFn')
        return new Promise((r) => setTimeout(() => {
          console.log('resolving with data')
          return r('data')
        }, 3000))
      },
    })
    return data || 'no data yet'
  }

  cy.clock()
  mount(<Example />)
  cy.contains('no data yet')
  // advance immediate by 3 seconds
  cy.tick(3010)
  // and the it shows "data"
  cy.contains(/^data$/, {timeout: 100})
})
