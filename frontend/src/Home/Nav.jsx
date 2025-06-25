import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav className="bg-white text-black p-4 flex justify-between rounded-b-4xl shadow-2xl fixed w-full">
      <Link to="/" className="font-bold text-2xl px-5">Job Portal</Link>
      <div className="space-x-4 flex gap-3">
        
          <button className='bg-[#f1faee] text-black rounded-4xl w-25 hover:bg-[#511D43] hover:text-white font-medium'>
        <Link to="/login">Login</Link>
        </button>
        <button className='bg-[#f1faee] text-black rounded-4xl w-25 hover:bg-[#511D43] hover:text-white font-medium'>
        <Link to="/signup">Signup</Link>
        </button>
      </div>
    </nav>
  );
}

export default Nav;