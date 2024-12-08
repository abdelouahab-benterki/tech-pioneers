import logo from "../../images/logo.png";
export default function ApplicationLogo(props) {
    return (
        <div className='w-10'>
            <img src={logo} className='w-full object-contain'/>
        </div>
    );
}
