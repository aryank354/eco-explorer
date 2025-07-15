import { Clock, Footprints } from 'lucide-react';

const RouteInfoPanel = ({ route, destination }) => {
  if (!route) return null;

  const distanceInKm = (route.distance / 1000).toFixed(2);
  const durationInMinutes = Math.round(route.duration / 60);

  return (
    <div className="h-full flex flex-col bg-card text-card-foreground">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold">Route to {destination}</h2>
        <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{durationInMinutes} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Footprints size={16} />
            <span>{distanceInKm} km</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <h3 className="p-4 text-md font-semibold">Directions</h3>
        <ul>
          {route.steps.map((step, index) => (
            <li key={index} className="flex items-start gap-4 p-3 border-b border-border last:border-b-0">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</div>
              <p className="flex-1 text-sm">{step}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RouteInfoPanel;