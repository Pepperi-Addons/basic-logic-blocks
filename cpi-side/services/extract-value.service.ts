import BaseCpiService from "./base-cpi.service";

type AnyObject = { [key: string]: any };

class ExtractValueCpiService extends BaseCpiService {
  private splitPath(path: string): (string | number | "*")[] {
    return path.split(".").map(this.parsePart);
  }

  private parsePart(part: string): string | number | "*" {
    if (part === "[*]") return "*";
    if (part.startsWith("[") && part.endsWith("]")) {
      const index = parseInt(part.slice(1, -1), 10);
      if (!isNaN(index)) return index;
    }
    return part;
  }

  private isEmpty(value: any): boolean {
    return (
      value === null ||
      value === undefined ||
      (typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0)
    );
  }

  getValue(obj: AnyObject | AnyObject[], path: string): any {
    const parts = this.splitPath(path);
    let current: any = obj;

    for (const part of parts) {
      if (part === "*") {
        const remainingPath = parts.slice(parts.indexOf(part) + 1).join(".");
        if (Array.isArray(current)) {
          return current
            .map((item) => this.getValue(item, remainingPath))
            .filter((value) => !this.isEmpty(value));
        }
        return {};
      } else if (typeof part === "number") {
        if (Array.isArray(current) && current[part] !== undefined) {
          current = current[part];
        } else {
          return {};
        }
      } else if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return {};
      }
    }

    return current;
  }
}

export default ExtractValueCpiService;
