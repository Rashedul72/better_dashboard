import { useRouter } from 'next/navigation'; // Use 'next/router' instead of 'next/navigation'
import { useEffect, useState } from 'react';

const withAdminAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        // Replace this with your actual authentication logic
        const isAuthenticated = true; // Assume a function that checks if the user is authenticated
        if (!isAuthenticated) {
          router.replace('/pages/admin'); // Adjust the redirect path as per your application
        } else {
          setLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return<span className="loading loading-dots loading-lg"></span>;
    }

    return <WrappedComponent {...props} />;
  };

  Wrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return Wrapper;
};

export default withAdminAuth;
