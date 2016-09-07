/**
 * Created by René Simon <mail@rene-simon.eu> on 30.04.16.
 * Copyright © Testacles 2016
 */

'use strict';

let _ = require('underscore');

function findById(model, id, populateFields) {
	return new Promise((resolve, reject) => {
		try {
			populateFields = populateFields || [];
			populateFields = _.isArray(populateFields) ? populateFields : [populateFields];
			let query = model.findById(id);
			for (let populateField of populateFields) {
				query = query.populate(populateField);
			}
			query.exec((error, entity) => {
				if (error) {
					reject(error);
				} else {
					resolve(entity);
				}
			});
		} catch (error) {
			reject(error);
		}
	});
}

function findOne(model, query, fields, options) {
	return new Promise((resolve, reject) => {
		try {
			fields = fields || null;
			options = options || {};
			model.find(query, fields, options, (error, entities) => {
				try {
					if (error) {
						throw error;
					}

					if (entities.length > 1) {
						throw new Error('Found more than one entity for query');
					}

					resolve(entities[0]);
				} catch (error) {
					error.data = {
						query: query
					};
					reject(error);
				}
			});
		} catch (error) {
			reject(error);
		}
	});
}

function find(model, query, fields, options) {
	return new Promise((resolve, reject) => {
		try {
			fields = fields || null;
			options = options || {};
			model.find(query, fields, options, (error, entities) => {
				if (error) {
					reject(error);
				} else {
					resolve(entities);
				}
			});
		} catch (error) {
			reject(error);
		}
	});
}

function save(model) {
	return new Promise((resolve, reject) => {
		try {
			if (!model || !model.save) {
				throw new Error('Invalid model given');
			}
			model.save((error, storedModel) => {
				if (error) {
					reject(error);
				} else {
					resolve(storedModel);
				}
			});
		} catch (error) {
			reject(error);
		}
	});
}

module.exports = {
	save: save,
	find: find,
	findById: findById,
	findOne: findOne
};
