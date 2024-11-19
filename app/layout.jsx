import NavBar from '@/components/NavBar';
import '@/assets/styles/globals.css'

export const metadata = {
    title: 'Property Pulse',
    keywords: 'rental, property, real estate',
    description: 'Find the perfect rental property'
}

const MainLayout = ({ children }) => {
    return ( <html>
        <body>
            <NavBar />
            <main>
                {children}
            </main>
        </body>
    </html> );
}
 
export default MainLayout;