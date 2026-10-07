const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Farmer Management API",
            version: "1.0.0",
            description:
                "API documentation for Farmer Management, Field, Material, Expense, Payment and Reporting System",
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local development server",
            },
        ],

        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },

        Expense: {
  type: "object",
  properties: {
    _id: {
      type: "string",
      example: "68c999999999abcdef999999",
    },

    date: {
      type: "string",
      format: "date-time",
      example: "2026-10-01T10:30:00.000Z",
    },

    farmer: {
      type: "string",
      example: "68c123456789abcdef123456",
    },

    field: {
      type: "string",
      example: "68c987654321abcdef654321",
    },

    workType: {
      type: "string",
      enum: [
        "Material",
        "Spray",
        "Labour",
        "Other",
        "Mixed",
      ],
      example: "Material",
    },

    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          material: {
            type: "string",
            example: "68c555555555abcdef555555",
          },
          materialName: {
            type: "string",
            example: "Urea",
          },
          quantity: {
            type: "number",
            example: 10,
          },
          unit: {
            type: "string",
            example: "Kg",
          },
          rate: {
            type: "number",
            example: 25,
          },
          total: {
            type: "number",
            example: 250,
          },
        },
      },
    },

    labourCost: {
      type: "number",
      example: 500,
    },

    otherCost: {
      type: "number",
      example: 100,
    },

    totalMaterialCost: {
      type: "number",
      example: 250,
    },

    totalExpense: {
      type: "number",
      example: 850,
    },

    notes: {
      type: "string",
      example: "Fertilizer application",
    },

    createdBy: {
      type: "string",
      example: "68c111111111abcdef111111",
    },

    createdAt: {
      type: "string",
      format: "date-time",
    },

    updatedAt: {
      type: "string",
      format: "date-time",
    },
  },
},
        tags: [
            {
                name: "Authentication",
                description: "User authentication and passcode management",
            },
            {
                name: "Farmers",
                description: "Farmer management APIs",
            },
            {
                name: "Fields",
                description: "Field and Gat management APIs",
            },
            {
                name: "Materials",
                description: "Agricultural material management APIs",
            },
            {
                name: "Expenses",
                description: "Daily expense management APIs",
            },
            {
                name: "Payments",
                description: "Farmer payment management APIs",
            },
            {
                name: "Dashboard",
                description: "Dashboard statistics APIs",
            },
            {
                name: "Reports",
                description: "Farmer, field, material and financial reports",
            },
        ],
    },

    // Read Swagger documentation from all route files
    apis: ["./src/routes/*.js"],
};

const swaggerDocument = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        })
    );
};

module.exports = setupSwagger;