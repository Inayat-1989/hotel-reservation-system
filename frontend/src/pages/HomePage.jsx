import NextPageButton from '../components/common/NextPageButton.jsx'
import HeroHeading from '../components/common/HeroHeading.jsx'

const HomePage = () => {

  return (
    <>
    <HeroHeading
      heading="Welcome"
      paragraph="Welcome! Step into a world of tailored hospitality designed exclusively for boutique stays and independent hosts."
    />
    <NextPageButton to='/menu' name='Check Menu' />
    </>
  )
}

export default HomePage
