import { bottombarLinks } from "@/constants";
import { Label } from "@radix-ui/react-label";
import { Link,useLocation } from "react-router-dom"

const Bottombar = () => {
  const {pathname} = useLocation()


  return (
    <div className='bottom-bar'>
      {bottombarLinks.map((link) => {
          const isActive = pathname === link.route;
          return(
            
              <Link to={link.route} key={link.label} className={`bottombar-link group ${isActive ? 'bg-primary-500 rounded-[10px] ' : ''} flex-center flex-col gap-1 p-2 transition`}>

              <p className="tiny-medium text-light-2">{link.label}</p>

              </Link>
           
          )
        })}
            
            <li>

            </li>




    </div>
  )
}

export default Bottombar