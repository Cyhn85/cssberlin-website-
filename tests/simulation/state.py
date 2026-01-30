from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class MatrixState:
    # IDs created during simulation
    seller_user_id: Optional[int] = None
    buyer_user_id: Optional[int] = None
    admin_user_id: Optional[int] = None

    product_id: Optional[int] = None
    offer_id: Optional[int] = None
    order_id: Optional[int] = None
    shipment_id: Optional[int] = None

    # Negotiated amount agreed by both sides
    agreed_price: Optional[float] = None

    # Signals
    product_created: asyncio.Event = field(default_factory=asyncio.Event)
    offer_created: asyncio.Event = field(default_factory=asyncio.Event)
    offer_responded: asyncio.Event = field(default_factory=asyncio.Event)
    order_paid: asyncio.Event = field(default_factory=asyncio.Event)
    shipped: asyncio.Event = field(default_factory=asyncio.Event)
    review_left: asyncio.Event = field(default_factory=asyncio.Event)
    done: asyncio.Event = field(default_factory=asyncio.Event)

