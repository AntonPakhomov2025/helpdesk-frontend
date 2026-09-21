const API_URL = 'http://localhost:7070';

export default class TicketApi {
  static async getAllTickets() {
    const res = await fetch(`${API_URL}?method=allTickets`);
    if (!res.ok) throw new Error('Failed to fetch tickets');
    return res.json();
  }
  static async getTicketById(id) {
    const res = await fetch(`${API_URL}?method=ticketById&id=${id}`);
    if (!res.ok) throw new Error('Failed to fetch ticket');
    return res.json();
  }
  static async createTicket(data) {
    const res = await fetch(`${API_URL}?method=createTicket`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create ticket');
    return res.json();
  }
  static async updateTicket(id, data) {
    const res = await fetch(`${API_URL}?method=updateById&id=${id}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update ticket');
    return res.json();
  }
  static async deleteTicket(id) {
    const res = await fetch(`${API_URL}?method=deleteById&id=${id}`);
    if (!res.ok && res.status !== 204) throw new Error('Failed to delete ticket');
    return res.status === 204 ? null : res.json();
  }
}
