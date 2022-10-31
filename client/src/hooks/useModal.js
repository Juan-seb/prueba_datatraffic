import { useState } from 'react'

const useModal = (initialValue = false) => {

  const [open, isOpen] = useState(initialValue)

  const openModal = () => isOpen(true)
  const closeModal = (e) => {
    e.stopPropagation()
    isOpen(false)
  }

  return { open, openModal, closeModal }

}

export { useModal }