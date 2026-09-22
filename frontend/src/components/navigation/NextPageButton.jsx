import { Link } from 'react-router-dom';

const NextPageButton = ({ to, name }) => {
  return (
    <div className="mt-8">
      <Link
        to={to}
        className="relative inline-block cursor-pointer border-2 border-white text-white bg-[#c93400] rounded-full align-middle no-underline p-0 text-base font-inherit group learn-more w-48 h-12 overflow-hidden"
      >
        <span className="transition-all duration-450 ease-[cubic-bezier(0.65,0,0.076,1)] absolute top-0 left-0 bottom-0 m-auto w-11 h-11 bg-white rounded-full group-hover:w-full flex items-center justify-start pl-3.5 z-10">
          <span
            className="transition-all duration-450 ease-[cubic-bezier(0.65,0,0.076,1)] relative block w-5 h-0.5 bg-[#c93400] group-hover:bg-[#c93400] group-hover:translate-x-4
            before:absolute before:content-[''] before:top-[-0.18rem] before:right-0 before:w-2 before:h-2 before:border-t-2 before:border-r-2 before:border-[#c93400] before:rotate-45"
          ></span>
        </span>

        <span className="transition-all duration-450 ease-[cubic-bezier(0.65,0,0.076,1)] absolute inset-0 py-2.5 pl-10 pr-0 my-0 text-white font-bold leading-normal text-center uppercase group-hover:text-[#c93400] z-20 flex items-center justify-center">
          {name}
        </span>
      </Link>
    </div>
  );
};

export default NextPageButton;
