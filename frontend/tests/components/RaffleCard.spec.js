import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RaffleCard from '../../src/components/RaffleCard.vue'

describe('RaffleCard', () => {
  const mockRaffle = {
    id: 1,
    name: 'Test Raffle',
    description: 'Test Description',
    image_url: '/test-image.jpg',
    quote_price: 10.00,
    total_quotes: 100,
    sold_quotes: 50,
    status: 'active'
  }

  it('renders properly', () => {
    const wrapper = mount(RaffleCard, {
      props: {
        raffle: mockRaffle
      }
    })
    
    expect(wrapper.text()).toContain('Test Raffle')
    expect(wrapper.text()).toContain('Test Description')
  })

  it('emits select-quote event when clicked', async () => {
    const wrapper = mount(RaffleCard, {
      props: {
        raffle: mockRaffle
      }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('select-quote')).toBeTruthy()
  })
})
