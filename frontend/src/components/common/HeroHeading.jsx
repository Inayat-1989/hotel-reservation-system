const HeroHeading = ({heading, paragraph}) => {
  return (
    <>
    <h1 className="text-3xl md:text-5xl font-bold text-[#c93400]">{heading}</h1>
    <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto">
        {paragraph}
    </p>
    </>
  )
}

export default HeroHeading