import "./Menu.css";
import { motion } from "framer-motion";
import Icon from "../Icon/Icon";
import settingsButton from '../../assets/settings-button.svg'
import anotherButton from '../../assets/refresh-button.svg'

export type childFunc = {
  setter: Function
}

export default function Menu({setter}: childFunc) {
  return (
    <motion.div className="side-menu"
      initial={{ opacity: 0, y: 10, scale: 1}}
      animate={{ opacity: 1, y: 0, scale: 1}}
      
      transition={{ duration: 0.3, delay: 0.2 }}
    >
    
        <Icon setter={setter} name="Browse" iconFile={settingsButton}/>
        <Icon setter={setter} name="Player" />
        <Icon setter={setter} name="Queue" iconFile={anotherButton}/>
      
    </motion.div>
  );
}
