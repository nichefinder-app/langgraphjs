export * from "./types.mjs";
import { storageConfig } from "../config.mjs";
import { PostgresStore } from "./postgres.mjs";
import { InMemoryStore } from "./memory.mjs";
import { StoreInterface } from "./types.mjs";
import { logger } from "../../logging.mjs";
import { type Operation, type OperationResults } from "@langchain/langgraph";

export class Store implements StoreInterface {
  private adapters: Record<string, StoreInterface> = {};

  async initialize(...args: Parameters<StoreInterface["initialize"]>): ReturnType<StoreInterface["initialize"]> {
    const adapter = await this.adapter();
    logger.debug(`[${this.implementation()}]#initialize`)
    return adapter.initialize(...args);
  }

  async flush(...args: Parameters<StoreInterface["flush"]>): ReturnType<StoreInterface["flush"]> {
    const adapter = await this.adapter();
    logger.debug(`[${this.implementation()}]#flush`)
    return adapter.flush(...args);
  }

  async clear(...args: Parameters<StoreInterface["clear"]>): Promise<void> {
    const adapter = await this.adapter();
    logger.debug(`[${this.implementation()}]#clear`)
    return adapter.clear(...args);
  }

  async batch<Op extends Operation[]>(operations: Op): Promise<OperationResults<Op>> {
    const adapter = await this.adapter();
    logger.debug(`[${this.implementation()}]#debug`)
    return adapter.batch(operations);
  }

  async get(...args: Parameters<StoreInterface["get"]>): ReturnType<StoreInterface["get"]> {
    const adapter = await this.adapter();
    logger.debug(`[${this.implementation()}]#get`)
    return adapter.get(...args);
  }

  async search(...args: Parameters<StoreInterface["search"]>): ReturnType<StoreInterface["search"]> {
    const adapter = await this.adapter();
    logger.debug(`[${this.implementation()}]#search`)
    return adapter.search(...args);
  }

  async put(...args: Parameters<StoreInterface["put"]>): ReturnType<StoreInterface["put"]> {
    const adapter = await this.adapter();
    logger.debug(`[${this.implementation()}]#put`)
    return adapter.put(...args);
  }

  async listNamespaces(...args: Parameters<StoreInterface["listNamespaces"]>): ReturnType<StoreInterface["listNamespaces"]> {
    const adapter = await this.adapter();
    logger.debug(`[${this.implementation()}]#listNamespaces`)
    return adapter.listNamespaces(...args);
  }

  private implementation(): string {
    if (storageConfig.POSTGRES_URI_CUSTOM) {
        return "postgres";
    } else {
        return "memory";
    }
  }

  private async adapter(): Promise<StoreInterface> {
    const impl = this.implementation();

    if (impl == "postgres") {
      if (this.adapters.postgres) return this.adapters.postgres;

      const options = {
        connectionOptions: storageConfig.POSTGRES_URI_CUSTOM,
        schema: storageConfig.POSTGRES_SCHEMA
      }
      this.adapters.postgres = new PostgresStore(options);
      return Promise.resolve(this.adapters.postgres);
    } else {
      if (this.adapters.memory) return this.adapters.memory; 

      this.adapters.memory = new InMemoryStore();
      return Promise.resolve(this.adapters.memory);
    }
  }
}