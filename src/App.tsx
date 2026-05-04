import { Navbar } from '@layouts/Navbar'
import { Footer } from '@layouts/Footer'
import HomePage   from '@pages/HomePage'

export default function App(): JSX.Element {
  return (
    <>
      <Navbar />
      <HomePage />
      <Footer />
    </>
  )
}
