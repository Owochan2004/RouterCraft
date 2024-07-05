import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

interface DataStructure {
  name: string;
  storage?: Location;
  clients: Location[];
}

interface MarkerData {
  id: number;
  position: {
    lat: number;
    lng: number;
  };
  color: 'blue' | 'red';
}

const Mapa: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [data, setData] = useState<DataStructure>({
    name: 'chirchull',
    storage: undefined,
    clients: []
  });
  const key = process.env.APP_GOOGLE_MAPS_API_KEY;

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newMarker: MarkerData = {
        id: Date.now(),
        position: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        },
        color: markers.length === 0 ? 'blue' : 'red'
      };
      setMarkers([...markers, newMarker]);

      if (markers.length === 0) {
        // First click, set as storage
        setData({
          ...data,
          storage: {
            name: 'almacen1',
            latitude: newMarker.position.lat,
            longitude: newMarker.position.lng
          }
        });
      } else {
        // Subsequent clicks, set as clients
        const newClient: Location = {
          name: `client${markers.length}`,
          latitude: newMarker.position.lat,
          longitude: newMarker.position.lng
        };
        setData({
          ...data,
          clients: [...data.clients, newClient]
        });
      }
    }
  };

  const handleMarkerRightClick = (markerId: number) => {
    const updatedMarkers = markers.filter(marker => marker.id !== markerId);
    setMarkers(updatedMarkers);

    if (updatedMarkers.length === 0) {
      // Remove storage if the first marker is deleted
      setData({
        ...data,
        storage: undefined
      });
    } else {
      // Update clients
      const updatedClients = updatedMarkers.slice(1).map((marker, index) => ({
        name: `client${index + 1}`,
        latitude: marker.position.lat,
        longitude: marker.position.lng
      }));
      setData({
        ...data,
        clients: updatedClients
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <LoadScript googleMapsApiKey={key || ''}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
        >
          {markers.map(marker => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={{
                url: `http://maps.google.com/mapfiles/ms/icons/${marker.color}-dot.png`
              }}
              onRightClick={() => handleMarkerRightClick(marker.id)}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      <div>
        <h2>Datos Guardados:</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Mapa;
