import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { FaGoogle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase.js';
import { signInSuccess } from '../redux/user/userSlice.js';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('Could not sign in with Google', error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
    >
      <FaGoogle />
      Continuar con Google
    </button>
  );
};

export default OAuth;
