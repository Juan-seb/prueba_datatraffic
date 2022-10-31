const Modal = ({ children, isOpen, closeModal }) => {

  const handleModalContainerClick = (e) => {
    e.stopPropagation()
  }

  return (
    <section className='fixed top-0 left-0 z-10 w-full h-screen bg-slate-700' onClick={(e) => closeModal(e)}>
      <div className='relative w-[95%] h-[90%] my-6 m-auto bg-white rounded-lg overflow-y-scroll' onClick={handleModalContainerClick}>
        <button className='absolute right-3 top-3'
         onClick={(e) => closeModal(e)}>
          ✖
        </button>
        {children}
      </div>
    </section>
  )

}

export default Modal