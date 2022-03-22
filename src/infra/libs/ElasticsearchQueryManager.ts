/* eslint-disable no-restricted-syntax */

import { Client } from "@elastic/elasticsearch";

interface QueryOptions {
  page: number;
  limit: number;
  sourceExcludes: string | string[];
  sourceIncludes: string | string[];
  sort: string | string[];
  highlight: unknown;
}

/* eslint-disable no-underscore-dangle */
class ElasticsearchQueryManager {
  client: Client;

  constructor(esClient: Client) {
    this.client = esClient;
  }

  async search({ index, query }, options: QueryOptions) {
    const {
      page = 1,
      limit = 20,
      sourceExcludes = [],
      sourceIncludes = [],
      sort = [],
      highlight = {},
    } = options;
    const { body } = await this.client.search({
      from: (page - 1) * limit,
      index,
      size: limit,
      sort,
      _source_excludes: sourceExcludes,
      _source_includes: sourceIncludes,
      body: {
        query,
        highlight,
      },
    });

    const { hits } = body.hits;

    const docs = hits.map((hit) => {
      return {
        doc: hit._source,
        score: hit._score,
        highlight: hit.highlight,
        _id: hit._id,
        id: hit._id,
      };
    });

    return { docs };
  }

  async query({ index, query }, options) {
    const { page = 1, limit = 20, sourceExcludes = [], sourceIncludes = [], sort = [] } = options;
    const { body } = await this.client.search({
      from: (page - 1) * limit,
      size: limit,
      sort,
      _source_excludes: sourceExcludes,
      _source_includes: sourceIncludes,
      index,
      body: {
        query,
      },
    });
    const { hits, total } = body.hits;
    const hasNextPage = total.value > page * limit;
    const hasPrevPage = page > 1;
    const totalDocs = total.value;
    const docs = [];
    for (const hit of hits) {
      docs.push({ ...hit._source, _id: hit._id, id: hit._id });
    }
    return {
      docs,
      pagination: {
        totalDocs,
        perPage: parseInt(limit, 10),
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(totalDocs / limit),
        serialNo: (page - 1) * limit + 1,
        hasPrevPage,
        hasNextPage,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
      },
    };
  }

  async update({ id, index, payload }) {
    const { body } = await this.client.update({
      index,
      id,
      body: {
        doc: payload,
      },
    });

    return body;
  }

  async index({ id, index, payload }) {
    const { body } = await this.client.index({
      index,
      id,
      body: payload,
    });

    return body;
  }

  async getById({ id, index }) {
    const { body } = await this.client.get({
      index,
      id,
    });

    return body;
  }

  async reIndex({ sourceIndex, sourceIndexQuery = {}, sourceIndexScript = "", destinationIndex }) {
    const { body } = await this.client.reindex({
      wait_for_completion: false,
      refresh: true,
      body: {
        source: {
          index: sourceIndex,
          query: sourceIndexQuery,
        },
        dest: {
          index: destinationIndex,
        },
        script: {
          lang: "painless",
          // source: "ctx._source.remove('house')",
          source: sourceIndexScript,
        },
      },
    });

    return body;
  }

  async createMapping({ index }) {
    const mappings = {
      properties: {
        activity: {
          type: "text",
        },
        businessId: {
          type: "keyword",
        },
        businessType: {
          type: "keyword",
        },
        createdAt: {
          type: "date",
        },
        deviceInfo: {
          properties: {
            browser: {
              type: "text",
            },
            os: {
              type: "text",
            },
            version: {
              type: "text",
            },
          },
        },
        event: {
          type: "keyword",
        },
        eventDateTime: {
          type: "date",
        },
        ipAddress: {
          type: "ip",
          index: false,
        },
        lastModifiedAt: {
          type: "date",
        },
        resource: {
          type: "keyword",
        },
        userId: {
          type: "text",
        },
      },
    };

    await this.client.indices.putMapping({
      index,
      body: mappings,
    });
  }

  async createIndex({ index }) {
    const { body: check } = await this.client.indices.exists({ index });
    if (!check) {
      await this.client.indices.create({ index });
      await this.createMapping({ index });
    }
  }

  // uncomment and modify the code below if you want to create multiple index and comment out the code above
  // async createIndex({ transactionIndexName, creditHistoryIndexName }) {
  //   const [{ body: transactionIndexCheck }, { body: creditHistoryIndexCheck }] = await Promise.all([
  //     this.client.indices.exists({ index: transactionIndexName }),
  //     this.client.indices.exists({ index: creditHistoryIndexName }),
  //   ]);

  //   if (!transactionIndexCheck) {
  //     await this.client.indices.create({ index: transactionIndexName });
  //     await this.createMapping({ transactionIndexName });
  //   }
  //   if (!creditHistoryIndexCheck) {
  //     await this.client.indices.create({ index: creditHistoryIndexName });
  //     await this.createMapping({ creditHistoryIndexName });
  //   }
  // }

  async isAliasExists({ index, indexAliasName }) {
    const { body } = await this.client.indices.existsAlias({ index, name: indexAliasName });
    return body;
  }

  async createAliasIndex({ index, indexAliasName }) {
    if (!(await this.isAliasExists({ index, indexAliasName }))) {
      const { body } = await this.client.indices.putAlias({ index, name: indexAliasName });
      return body;
    }
    return null;
  }

  async deleteAliasIndex({ index, indexAliasName }) {
    if (!(await this.isAliasExists({ index, indexAliasName }))) {
      const { body } = await this.client.indices.deleteAlias({ index, name: indexAliasName });
      return body;
    }
    return null;
  }
}

export default ElasticsearchQueryManager;
