import { Link } from 'react-router-dom'

const NextPageButton = ({ to, name }) => {
  return (
    <div className='mt-8'>
      <Link to={to} className="relative inline-block cursor-pointer border-2 border-white hover:border-[#c93400] rounded-full align-middle no-underline bg-transparent p-0 text-base font-inherit group learn-more w-48 h-auto">
      <span className="transition-all duration-450 ease-[cubic-bezier(0.65,0,0.076,1)] relative block m-0 w-12 h-12 bg-[#c93400] rounded-[1.625rem] group-hover:w-full">
          <span className="transition-all duration-450 ease-[cubic-bezier(0.65,0,0.076,1)] absolute inset-y-0 my-auto bg-[#c93400] icon arrow left-2.5 w-4.5 h-0.5 bg-none group-hover:bg-[#c93400] group-hover:translate-x-4 before:absolute before:content-[''] before:top-[-0.29rem] before:right-px before:w-2.5 before:h-2.5 before:border-t-2 before:border-r-2 before:border-white before:rotate-45"></span>
      </span>
      <span className="transition-all duration-450 ease-[cubic-bezier(0.65,0,0.076,1)] absolute inset-0 py-3 pl-[1.85rem] pr-0 my-0 text-white font-bold leading-normal text-center uppercase group-hover:text-white">
          {name}
      </span>
      </Link>
    </div>
  )
}

export default NextPageButton