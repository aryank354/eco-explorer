import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchScenicRoute } from '../api/routeService';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Search, MapPin } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";

import MapView from '../components/MapView';
import RouteInfoPanel from '../components/RouteInfoPanel';
import { useOneTimeLocation } from '../hooks/useOneTimeLocation';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { ThemeToggle } from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';

function DashboardPage() {
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [startPoint, setStartPoint] = useState('Your Location');
  const [endPoint, setEndPoint] = useState('India Gate, Delhi');
  const [startCoords, setStartCoords] = useState({ lat: 28.6139, lng: 77.2090 }); // Default start

  const { getLocation, isFetching: isFetchingLocation } = useOneTimeLocation();
  const { isSlowConnection } = useNetworkStatus();

  const handleSearch = async () => {
    let currentStartCoords = startCoords;

    if (startPoint === 'Your Location') {
      try {
        const location = await getLocation();
        currentStartCoords = location;
        setStartCoords(location);
      } catch (err) {
        alert(`Could not get your location: ${err.message}`);
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const newRoute = await fetchScenicRoute(currentStartCoords, endPoint);
      setRoute(newRoute);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load initial route
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      <header className="flex items-center justify-between p-2 border-b bg-card/80 backdrop-blur-sm z-10 gap-4">
        <Link to="/" className="p-2">
          <h1 className="text-lg md:text-xl font-bold tracking-tighter hover:text-primary transition-colors">Eco-Explorer 🗺️</h1>
        </Link>
        <div className="flex-1 flex justify-center items-center gap-2">
          <div className="relative w-full max-w-xs">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" value={startPoint} onChange={(e) => setStartPoint(e.target.value)} className="pl-10" />
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Enter a destination..." 
              className="pl-10"
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={isFetchingLocation}>
            {isFetchingLocation ? 'Finding You...' : 'Find Route'}
          </Button>
        </div>
        <div className="flex items-center gap-2 p-2">
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 relative">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={30} minSize={20}>
            <AnimatePresence>
              {route && !isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="h-full">
                  <RouteInfoPanel route={route} destination={endPoint} />
                </motion.div>
              )}
            </AnimatePresence>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            <div className="h-full w-full relative">
              <AnimatePresence>
                {(isLoading || isFetchingLocation) && (
                  <motion.div key="loader" className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50" exit={{ opacity: 0 }}>
                    <LoadingSpinner />
                  </motion.div>
                )}
                {isSlowConnection && (
                  <motion.div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-500 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }}>
                    <WifiOff size={16} /> Low Data Mode Activated
                  </motion.div>
                )}
              </AnimatePresence>
              {error && <p className="text-destructive p-4 absolute top-4 left-4 z-50 bg-card rounded-md">{error}</p>}
              {route && ( <MapView route={route.path} startPoint={startCoords} endPoint={endPoint} isSlowConnection={isSlowConnection} /> )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}

export default DashboardPage;