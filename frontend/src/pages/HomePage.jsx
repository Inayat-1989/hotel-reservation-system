import NextPageButton from '../components/common/NextPageButton.jsx'

const HomePage = () => {

  return (
    <>
    <div className="absolute inset-0 -z-10 bg-black/40 blur-xl rounded-full scale-150 pointer-events-none" />
    <div className="flex flex-col items-center max-w-md">
      <h1 className="mb-5 text-5xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        Welcome
      </h1>
      <p className="mb-8 text-neutral-100 text-xl md:text-2xl font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        Welcome! Step into a world of tailored hospitality designed exclusively for boutique stays and independent hosts.
      </p>
      <NextPageButton to='/menu' name='Check Menu' />
    </div>
    </>
  )
}

export default HomePage
