import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import classes from './main-navigation.module.css';

function MainNavigation() {
  const { data: session, status } = useSession()
  console.log(session)
  console.log(status)
  function logoutHandler() {
    signOut({ callbackUrl: '/auth' });
  }
  return (
    <header className={classes.header}>
      <Link href='/'>
        <a>
          <div className={classes.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          {!session && status !== 'loading' && (
            <li>
              <Link href='/auth'>Login</Link>
            </li>
          )}

          {status === "authenticated" && (
            <>
              <li>
                <Link href='/profile'>Profile</Link>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>
          )}

        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
