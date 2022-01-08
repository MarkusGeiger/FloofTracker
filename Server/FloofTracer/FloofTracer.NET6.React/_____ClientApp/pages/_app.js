const Layout = ({ children }) => <div className="layout">{children}</div>

import BottomNav from '../components/BottomNav'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (<Layout>
            <Component {...pageProps} />
            <BottomNav></BottomNav>
          </Layout>)
}

export default MyApp
