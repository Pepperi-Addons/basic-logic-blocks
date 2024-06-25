import BaseCpiService from "./base-cpi.service";

type AnyObject = { [key: string]: any };

class ExtractValueCpiService extends BaseCpiService {
  extraction(value: any, context: any) {
    try {
      const path = this.extractPath(value.SourcePath, context);
      const object = context[value?.Object?.Value]
        ? context[value?.Object?.Value]
        : {};
      const getValue = this.getValue(object, path);
      return {
        Value: { Value: getValue, Type: this.getType(getValue) },
      };
    } catch (e) {
      console.log((e as Error).message);
      return {};
    }
  }

  private extractPath(
    sourcePath: { Value: string; FlowParamSource: string; Type: any },
    context: any
  ) {
    switch (sourcePath.FlowParamSource) {
      case "Static": {
        return sourcePath.Value;
      }
      case "Dynamic": {
        return context[sourcePath.Value];
      }
      default: {
        return sourcePath.Value;
      }
    }
  }

  hasValue<T>(obj: T): boolean {
    if (obj === null || obj === undefined) {
      return false; // Check if the object is null or undefined
    }

    const value = obj['Value'];

    if (value === undefined || value === null) {
      return false; // Property is undefined or null
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      // For objects, check if they have any properties
      return Object.keys(value).length > 0;
    }

    if (Array.isArray(value)) {
      // For arrays, check if they have any elements
      return value.length > 0;
    }

    // For other types, just check if they are not empty or falsey
    return Boolean(value);
  }

  private getType(value: any) {
    const type = typeof value;
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  private splitPath(path: string): (string | number | "*")[] {
    return path.split(".").map(this.parsePart);
  }

  private parsePart(part: string): string | number | "*" {
    if (part === "[*]") {
      return "*";
    }
    if (part.startsWith("[") && part.endsWith("]")) {
      const index = parseInt(part.slice(1, -1), 10);
      if (!isNaN(index)) {
        return index;
      }
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

  private getValue(obj: AnyObject | AnyObject[], path: string): any {
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

  // private getDynamicPageParamValue(value: any, context: any) {
  //   if (value && value.FlowParamSource === "Static") {
  //     return value.Value || "";
  //   } else if (value && value.FlowParamSource === "Dynamic") {
  //     const pageParams = context.State?.PageParameters || {};
  //     return pageParams[value.Value] || "";
  //   }

  //   return value.Value;
  // }
}

export default ExtractValueCpiService;
