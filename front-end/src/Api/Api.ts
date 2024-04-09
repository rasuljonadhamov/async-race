import { CarI, DriveI, GetCarsI, StartStopI } from "./interfaces";

interface WinnerData {
  id: number;
  wins: number;
  time: number;
}
interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface GarageSlot {
  id: number;
  start: () => Promise<[number, number] | [number, null]> | undefined;
}

class API {
  protected static base = "http://127.0.0.1:3000";

  protected static garage = `${API.base}/garage`;

  protected static engine = `${API.base}/engine`;

  protected static winners = `${API.base}/winners`;

  static async getWinner(id: number): Promise<Winner | null> {
    try {
      const resp = await fetch(`${API.winners}/${id}`);
      if (!resp.ok) {
        throw new Error("Failed to fetch winner");
      }
      return resp.json();
    } catch (error) {
      console.error("Error fetching winner:", error);
      return null;
    }
  }

  static async createWinner(
    winnerData: Partial<WinnerData>
  ): Promise<Winner | null> {
    try {
      const existingWinners = await API.getWinners();
      const nextId =
        existingWinners.length > 0
          ? Math.max(...existingWinners.map((winner) => winner.id)) + 1
          : 1;

      const winnerWithId = { ...winnerData, id: nextId };

      // console.log(winnerWithId, "does have");

      const resp = await fetch(API.winners, {
        method: "POST",
        body: JSON.stringify(winnerWithId),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        throw new Error("Failed to create winner");
      }

      const data = await resp.json();

      return data as Winner;
    } catch (error) {
      console.error("Error creating winner:", error);
      return null;
    }
  }

  static async updateWinner(
    id: number,
    winnerData: Partial<Winner>
  ): Promise<Winner | null> {
    try {
      const resp = await fetch(`${API.winners}/${id}`, {
        method: "PUT",
        body: JSON.stringify(winnerData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!resp.ok) {
        throw new Error("Failed to update winner");
      }
      return resp.json();
    } catch (error) {
      console.error("Error updating winner:", error);
      return null;
    }
  }

  static async getCars(): Promise<GetCarsI> {
    const resp = await fetch(API.garage);
    const items = await resp.json();
    const totalCount = Number(resp.headers.get("X-Total-Count"));
    return { items, totalCount };
  }

  static async getCar(id: number): Promise<CarI> {
    const resp = await fetch(`${API.garage}/${id}`);
    return resp.json();
  }

  static async createCar(body: Pick<CarI, "name" | "color">): Promise<CarI> {
    const resp = await fetch(API.garage, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return resp.json();
  }

  static async updateCar(
    id: number,
    body: Pick<CarI, "name" | "color">
  ): Promise<CarI> {
    const resp = await fetch(`${API.garage}/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return resp.json();
  }

  static async deleteCar(id: number): Promise<{} | void> {
    try {
      const resp = await fetch(`${API.garage}/${id}`, { method: "DELETE" });
      if (resp.status === 404) {
        throw new Error("This car doesn't exist");
      }
      return resp.json();
    } catch (error) {
      console.error(error.message);
    }
  }

  static async startEngine(id: number): Promise<StartStopI> {
    const resp = await fetch(`${API.engine}?id=${id}&status=started`, {
      method: "PATCH",
    });
    return resp.json();
  }

  static async stopEngine(id: number): Promise<StartStopI> {
    const resp = await fetch(`${API.engine}?id=${id}&status=stopped`, {
      method: "PATCH",
    });
    return resp.json();
  }

  static async getWinners(): Promise<any[]> {
    try {
      const resp = await fetch(API.winners);
      return resp.json();
    } catch (error) {
      console.error("Error fetching winners:", error);
      return [];
    }
  }

  static async determineOverallWinner(winnersData: any[]): Promise<any | null> {
    try {
      if (winnersData.length > 0) {
        // Determine the overall winner based on your criteria
        const winner = winnersData.reduce((prevWinner, currentWinner) => {
          // Replace this logic with your own criteria for determining the winner
          return prevWinner.time < currentWinner.time
            ? prevWinner
            : currentWinner;
        });
        return winner;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error determining overall winner:", error);
      return null;
    }
  }

  static async drive(id: number): Promise<DriveI> {
    try {
      const resp = await fetch(`${API.engine}?id=${id}&status=drive`, {
        method: "PATCH",
      });

      const status = resp.status;

      if (status !== 200) {
        throw new Error(status.toString());
      }

      const data = resp.json();

      return {
        status,
        data,
      };
    } catch (e) {
      console.error("error", e);
      return {
        status: +(e as Error).message,
      };
    }
  }
}

export default API;
