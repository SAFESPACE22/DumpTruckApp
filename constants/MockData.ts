export interface Pit {
  id: string;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  materials: string[];
  price: string; // e.g. "$12/ton"
  phone: string;
  hours: string; // e.g. "M-F 8am-5pm"
  type?: 'DUMP' | 'PICKUP'; // New field for role-based logic
}

export const MATERIAL_TYPES = [
  "Red Pit",
  "Sand Pit",
  "Fill Sand",
  "Topsoil",
  "Gravel",
  "Crushed Concrete",
];

export const MOCK_PITS: Pit[] = [
  {
    id: "1",
    name: "Valley Red Pit",
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
    materials: ["Red Pit", "Topsoil"],
    price: "$15/ton",
    phone: "(555) 123-4567",
    hours: "M-F 7:00 AM - 5:00 PM",
  },
  {
    id: "2",
    name: "Bayside Sand & Fill",
    coordinate: {
      latitude: 37.75825,
      longitude: -122.4624,
    },
    materials: ["Sand Pit", "Fill Sand", "Gravel"],
    price: "$12/ton",
    phone: "(555) 987-6543",
    hours: "M-Sat 6:00 AM - 4:00 PM",
  },
  {
    id: "3",
    name: "Downtown Crushing",
    coordinate: {
      latitude: 37.77825,
      longitude: -122.4124,
    },
    materials: ["Crushed Concrete", "Gravel"],
    price: "$20/ton",
    phone: "(555) 555-5555",
    hours: "M-F 8:00 AM - 4:00 PM",
  },
  {
    id: "4",
    name: "Westside Soil",
    coordinate: {
      latitude: 37.76825,
      longitude: -122.4824,
    },
    materials: ["Red Pit", "Fill Sand"],
    price: "$10/ton",
    phone: "(555) 222-3333",
    hours: "M-F 7:30 AM - 3:30 PM",
  },
  {
    id: "5",
    name: "North Bay Aggregates",
    coordinate: {
      latitude: 37.80825,
      longitude: -122.4224,
    },
    materials: ["Sand Pit", "Topsoil"],
    price: "$18/ton",
    phone: "(555) 444-4444",
    hours: "M-F 7:00 AM - 5:00 PM",
  },
];
