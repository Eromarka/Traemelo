
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category_id: string;
    rating: number;
    is_promo: boolean;
    store_name?: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    order: number;
    path: string;
    color: string;
}

export interface Restaurant {
    id: string;
    name: string;
    rating: number;
    category: string;
    image_url: string;
    delivery_time: string;
    delivery_fee: number;
    phone: string;
    whatsapp?: string;
}

export const localCategories: Category[] = [
    { id: '1', name: 'Restaurantes', icon: 'restaurant', order: 1, path: '/search?category=1', color: 'text-orange-400' },
    { id: '2', name: 'Licores', icon: 'liquor', order: 2, path: '/search?category=2', color: 'text-purple-400' },
    { id: '3', name: 'Farmacia', icon: 'medical_services', order: 3, path: '/search?category=3', color: 'text-blue-400' },
    { id: '4', name: 'Panadería', icon: 'bakery_dining', order: 4, path: '/search?category=4', color: 'text-yellow-400' },
    { id: '5', name: 'Frutas y Verduras', icon: 'eco', order: 5, path: '/search?category=5', color: 'text-green-400' },
    { id: '6', name: 'Ferretería', icon: 'construction', order: 6, path: '/search?category=6', color: 'text-orange-600' },
    { id: '7', name: 'Repuestos', icon: 'settings_input_component', order: 7, path: '/search?category=7', color: 'text-slate-400' },
    { id: '8', name: 'Agro', icon: 'agriculture', order: 8, path: '/search?category=8', color: 'text-emerald-400' },
    { id: '9', name: 'Moda y Calzado', icon: 'apparel', order: 9, path: '/search?category=9', color: 'text-pink-400' },
    { id: '10', name: 'Supermercados', icon: 'shopping_basket', order: 10, path: '/search?category=10', color: 'text-red-400' },
    { id: '11', name: 'Servicios', icon: 'plumbing', order: 11, path: '/search?category=11', color: 'text-cyan-400' },
];

export const localProducts: Product[] = [
    {
        id: 'p1',
        name: 'Hamburguesa Triple Especial',
        description: 'La hamburguesa más jugosa de la ciudad con salsa secreta.',
        price: 8.50,
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
        category_id: '1', // Restaurantes
        rating: 4.8,
        is_promo: true,
        store_name: 'San Juan Burger'
    },
    {
        id: 'p2',
        name: 'Whisky 12 Años',
        description: 'Botella de whisky de reserva especial, ideal para celebrar.',
        price: 35.00,
        image_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&q=80&w=800',
        category_id: '2', // Licores
        rating: 4.9,
        is_promo: false
    },
    {
        id: 'p3',
        name: 'Analgésico 500mg',
        description: 'Blister x10 tabletas para alivio rápido.',
        price: 4.00,
        image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
        category_id: '3', // Farmacias
        rating: 4.5,
        is_promo: false
    },
    {
        id: 'p4',
        name: 'Pan Canilla Fresco',
        description: '2 unidades de pan recién horneado.',
        price: 1.50,
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
        category_id: '4', // Panaderías
        rating: 4.7,
        is_promo: true
    },
    {
        id: 'p5',
        name: 'Combo Fresas y Cambur',
        description: '1kg de fresas con 1kg de cambur fresco.',
        price: 5.00,
        image_url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800',
        category_id: '5', // Fruterías
        rating: 4.6,
        is_promo: false
    },
    {
        id: 'p8',
        name: 'Solomo de Cuerito Premium',
        description: 'Corte de carne de primera, ideal para parrilla (1kg app).',
        price: 12.00,
        image_url: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=800',
        category_id: '1',
        rating: 4.9,
        is_promo: false,
        store_name: 'Traemelo Concierge'
    },
    {
        id: 'p9',
        name: 'Harina P.A.N. (Pack 4)',
        description: 'Paquete de 4 unidades de harina de maíz precocida.',
        price: 6.00,
        image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=800',
        category_id: '5',
        rating: 5.0,
        is_promo: true,
        store_name: 'Traemelo Concierge'
    },
    {
        id: 'p10',
        name: 'Filete de Salmón Fresco',
        description: 'Pescado fresco del día (500g).',
        price: 15.50,
        image_url: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=800',
        category_id: '1',
        rating: 4.7,
        is_promo: false,
        store_name: 'Traemelo Concierge'
    },
    {
        id: 'p11',
        name: 'Saco de Cemento Gris',
        description: 'Saco de 42.5kg para construcción.',
        price: 9.00,
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
        category_id: '6', // Construcción
        rating: 4.5,
        is_promo: false,
        store_name: 'Traemelo Concierge'
    },
    {
        id: 'p12',
        name: 'Tubo PVC 1/2"',
        description: 'Tubo de alta presión para aguas blancas (6mts).',
        price: 3.50,
        image_url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=800',
        category_id: '6',
        rating: 4.3,
        is_promo: false,
        store_name: 'Traemelo Concierge'
    },
    {
        id: 'p13',
        name: 'Refresco Cola 2L',
        description: 'Bebida gaseosa familiar.',
        price: 2.50,
        image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
        category_id: '2',
        rating: 4.8,
        is_promo: false,
        store_name: 'Traemelo Concierge'
    },
    {
        id: 'p14',
        name: 'Pack Cerveza Premium (6)',
        description: 'Six-pack de cerveza fría artesanal.',
        price: 10.00,
        image_url: 'https://images.unsplash.com/photo-1550341919-9099bfa4029b?auto=format&fit=crop&q=80&w=800',
        category_id: '2',
        rating: 4.6,
        is_promo: true,
        store_name: 'Traemelo Concierge'
    },
    {
        id: 'p15',
        name: 'Bombillo LED 12W',
        description: 'Ahorro energético, luz blanca.',
        price: 1.50,
        image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
        category_id: '7', // Repuestos
        rating: 4.4,
        is_promo: false,
        store_name: 'Traemelo Concierge'
    },
    {
        id: 'p16',
        name: 'Aceite de Motor 20W50',
        description: 'Lubricante mineral para motor a gasolina.',
        price: 7.00,
        image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800',
        category_id: '7',
        rating: 4.7,
        is_promo: false,
        store_name: 'Traemelo Concierge'
    },
    {
        id: 'p17',
        name: 'Fertilizante NPK 1kg',
        description: 'Abono para plantas y huertos caseros.',
        price: 4.50,
        image_url: 'https://images.unsplash.com/photo-1592982537447-74407b16518a?auto=format&fit=crop&q=80&w=800',
        category_id: '8', // Agro
        rating: 4.8,
        is_promo: false,
        store_name: 'Traemelo Concierge'
    },
    {
        id: 'p18',
        name: 'Pala de Construcción',
        description: 'Herramienta de acero reforzada.',
        price: 12.50,
        image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
        category_id: '6',
        rating: 4.6,
        is_promo: false,
        store_name: 'Traemelo Concierge'
    },
    {
        id: 'p19',
        name: 'Pack Agua Mineral (12)',
        description: 'Botellas de 500ml de agua pura.',
        price: 5.50,
        image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800',
        category_id: '5',
        rating: 4.9,
        is_promo: false,
        store_name: 'Traemelo Concierge'
    },
    {
        id: 'p20',
        name: 'Juego de Destornilladores',
        description: 'Set de 6 piezas de cromo vanadio.',
        price: 8.00,
        image_url: 'https://images.unsplash.com/photo-1586864387917-fec07a52a799?auto=format&fit=crop&q=80&w=800',
        category_id: '7',
        rating: 4.5,
        is_promo: false,
        store_name: 'Traemelo Concierge'
    }
];

export const localRestaurants: Restaurant[] = [
    {
        id: 'r1',
        name: 'San Juan Burger',
        rating: 4.8,
        category: '1',
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
        delivery_time: '20-30 min',
        delivery_fee: 0,
        phone: '+584141234567'
    },
    {
        id: 'r2',
        name: 'Prolicor',
        rating: 4.9,
        category: '2',
        image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
        delivery_time: '15-25 min',
        delivery_fee: 0,
        phone: '+584148765432'
    },
    {
        id: 'r3',
        name: 'FARMA24',
        rating: 4.5,
        category: '3',
        image_url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800',
        delivery_time: '10-20 min',
        delivery_fee: 0,
        phone: '+584120001122'
    },
    {
        id: 'r4',
        name: 'Panadería La Cascada',
        rating: 4.7,
        category: '4',
        image_url: 'https://images.unsplash.com/photo-1555507036-ab1e4006aaeb?auto=format&fit=crop&q=80&w=800',
        delivery_time: 'Inmediato',
        delivery_fee: 0,
        phone: '+584141112233'
    },
    {
        id: 'r5',
        name: 'Auto-Partes San Miguel',
        rating: 4.4,
        category: '7',
        image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800',
        delivery_time: 'Hoy mismo',
        delivery_fee: 0,
        phone: '+584125556667'
    },
    {
        id: 'r6',
        name: 'Agrodensa',
        rating: 4.9,
        category: '8',
        image_url: 'https://images.unsplash.com/photo-1592982537447-74407b16518a?auto=format&fit=crop&q=80&w=800',
        delivery_time: '2-3 días',
        delivery_fee: 0,
        phone: '+584163456789'
    },
    {
        id: 'r7',
        name: 'Traemelo Concierge',
        rating: 5.0,
        category: '9',
        image_url: 'https://images.unsplash.com/photo-1534452286304-b6251787c3c3?auto=format&fit=crop&q=80&w=800',
        delivery_time: 'Personalizado',
        delivery_fee: 0,
        phone: '+584140000000'
    }
];

