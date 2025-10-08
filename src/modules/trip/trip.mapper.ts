import { DTO_RP_ListTrip, EmployeeItem } from './trip.dto';
import { Trip } from '../../entities/trip.entity';

export class TripMapper {
  static mapToTripListDTO(trips: Trip[]): DTO_RP_ListTrip[] {
    return trips.map((trip) => {
      return {
        trip_id: trip.id,
        trip_type: trip.trip_type,
        departure_date: trip.departure_date,
        departure_time: trip.departure_time?.split(':').slice(0, 2).join(':'),
        vehicle_id: trip.vehicle?.id || null,
        note: trip.note,
        driver: this.mapDriversToEmployeeItems(trip.driver),
        assistant: this.mapAssistantsToEmployeeItems(trip.assistant),
        route_id: trip.route?.id || null,
        route_name: trip.route?.route_name || null,
        seat_chart_id: trip.seat_chart?.id || null,
        seat_chart_name: trip.seat_chart?.seat_chart_name || null,
        license_plate: trip.vehicle?.license_plate || null,
        vehicle_phone: trip.vehicle?.phone || null,
        tickets_booked: trip.ticket_summary?.booked_tickets || 0,
        total_ticket: trip.ticket_summary?.total_tickets || 0,
        confirmation_depart: trip.confirmation_depart,
        ticket_price: trip.ticket_price || 0,
        total_fare: 0,
        total_tickets_price: trip.ticket_summary?.total_tickets_price || 0,
      };
    });
  }
  private static mapDriversToEmployeeItems(drivers: any): EmployeeItem[] {
    if (!drivers) return [];

    // Case 1: drivers là array
    if (Array.isArray(drivers)) {
      return drivers.map((driver) => ({
        id: driver.id || driver._id || '',
        name: driver.name || '',
        phone: driver.phone || '',
      }));
    }

    // Case 2: drivers là JSON string
    if (typeof drivers === 'string') {
      try {
        const parsedDrivers = JSON.parse(drivers);
        if (Array.isArray(parsedDrivers)) {
          return parsedDrivers.map((driver) => ({
            id: driver.id || '',
            name: driver.name || '',
            phone: driver.phone || '',
          }));
        }
      } catch (error) {
        console.warn('Failed to parse drivers JSON:', error);
        return [];
      }
    }

    // Case 3: drivers là single object
    if (typeof drivers === 'object') {
      return [
        {
          id: drivers.id || drivers._id || '',
          name: drivers.name || '',
          phone: drivers.phone || '',
        },
      ];
    }

    return [];
  }

  private static mapAssistantsToEmployeeItems(assistants: any): EmployeeItem[] {
    if (!assistants) return [];

    // Case 1: assistants là array
    if (Array.isArray(assistants)) {
      return assistants.map((assistant) => ({
        id: assistant.id || assistant._id || '',
        name: assistant.name || '',
        phone: assistant.phone || '',
      }));
    }

    // Case 2: assistants là JSON string
    if (typeof assistants === 'string') {
      try {
        const parsedAssistants = JSON.parse(assistants);
        if (Array.isArray(parsedAssistants)) {
          return parsedAssistants.map((assistant) => ({
            id: assistant.id || '',
            name: assistant.name || '',
            phone: assistant.phone || '',
          }));
        }
      } catch (error) {
        console.warn('Failed to parse assistants JSON:', error);
        return [];
      }
    }

    // Case 3: assistants là single object
    if (typeof assistants === 'object') {
      return [
        {
          id: assistants.id || '',
          name: assistants.name || '',
          phone: assistants.phone || '',
        },
      ];
    }

    return [];
  }
}
