import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/authentication";


export default async function Home() {
  const session = await getAuthSession();

  if (!session) 
  {
      console.log('Session not found. User is not authenticated.');
  }
  return (
    <div className='mt-10'>
        <h1>Welcome, {session?.user?.name || 'User'}!</h1>
    </div>
    
  );
}
