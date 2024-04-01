import { CarI, DriveI, EngineStatus, GetCarsI, StartStopI } from "./interfaces";

class API {
  protected static base = "http://127.0.0.1:3000";

  protected static garage = `${API.base}/garage`;

  protected static engine = `${API.base}/engine`;

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
    const resp = await fetch(
      `${API.engine}?id=${id}&status=${EngineStatus.START}`,
      {
        method: "PATCH",
      }
    );
    return resp.json();
  }

  static async stopEngine(id: number): Promise<StartStopI> {
    const resp = await fetch(
      `${API.engine}?id=${id}&status=${EngineStatus.STOP}`,
      {
        method: "PATCH",
      }
    );
    return resp.json();
  }

  static async drive(id: number): Promise<DriveI> {
    try {
      const resp = await fetch(
        `${API.engine}?id=${id}&status=${EngineStatus.DRIVE}`,
        {
          method: "PATCH",
        }
      );

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
