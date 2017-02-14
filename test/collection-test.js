import Backbone from 'backbone';
import _ from 'underscore';
import Occurrence from '../src/Occurrence';
import Collection from '../src/Collection';
import Morel from '../src/main';
import Sample from '../src/Sample';
import Store from '../src/Store';
import Media from '../src/Media';
import helpers from '../src/helpers';
import serverResponses from './server_responses.js';
import { getRandomSample } from './helpers';
import { API_BASE, API_VER, API_SAMPLES_PATH } from '../src/constants';

/* eslint-disable no-unused-expressions */
const SAMPLE_POST_URL = API_BASE + API_VER + API_SAMPLES_PATH;

describe('Collection', () => {
  const store = new Store();
  const storedCollection = new Collection([], { store, model: Sample });

  before((done) => {
    // clean up in case of trash
    storedCollection.fetch()
      .then(() => storedCollection.destroy())
      .then(() => done());
  });

  beforeEach((done) => {
    // clean up in case of trash
    storedCollection.fetch()
      .then(() => storedCollection.destroy())
      .then(() => done());
  });

  after((done) => {
    // clean up afterwards
    storedCollection.fetch()
      .then(() => storedCollection.destroy())
      .then(() => done());
  });

  it('should be a Backbone collection', () => {
    expect(storedCollection).to.be.instanceOf(Backbone.Collection);
  });

  it('should set, get and has', (done) => {
    const sample = new Sample();
    const key = Date.now().toString();
    const value = Math.random();

    sample.set(key, value);

    storedCollection.set(sample);

    const data = storedCollection.get(sample);
    expect(data).to.be.instanceof(Sample);
    expect(sample.get(key)).to.be.equal(data.get(key));

    let contains = storedCollection.has(sample)
    expect(contains).to.be.true;

    contains = storedCollection.has(new Sample());
    expect(contains).to.be.false;

    done();
  });

  //
  // it('should save', (done) => {
  //   storedCollection.create({ hello: 'world!' })
  //   then((model) => {
  //     id = model.get('id');
  //
  //     expect(model).to.exist;
  //     expect(id).to.exist;
  //     expect(model.get('hello')).toEqual('world!');
  //
  //     done();
  //   });
  // });

  it('should fetch', (done) => {
    const sample = getRandomSample(store);
    sample.save({ myattr: 'val' }).then(() => {
      const collection = new Collection([], { store, model: Sample });

      collection.fetch()
        .then(() => {
          expect(collection.length).to.be.equal(1);

          const model = collection.get(sample);

          expect(model).to.exist;
          expect(model.attributes).to.be.equal(sample.attributes);

          done();
        });
    });
  });

  it('should return JSON', () => {
    const occurrence = new Occurrence();
    const collection = new Collection([], {
      model: Occurrence,
    });
    expect(collection.model).to.be.equal(Occurrence);

    collection.set(occurrence);
    expect(collection.length).to.be.equal(1);
    const json = collection.toJSON();

    expect(json).to.be.an.array;
    expect(json.length).to.be.equal(1);
    expect(json[0].cid).to.be.equal(occurrence.cid);
  });

  it('should return promises', () => {
    const sample = getRandomSample(store);
    storedCollection.set(sample);

    const promise = storedCollection.destroy();

    expect(promise).to.be.instanceOf(Promise);
  });

  // it('should fetch and destroy', (done) => {
  //   const sample = new Sample();
  //   const sample2 = new Sample();
  //
  //   storedCollection.destroy()
  //     .then(() => storedCollection.set(sample))
  //     .then(() => storedCollection.set(sample2))
  //     .then(() => storedCollection.has(sample))
  //     .then((contains) => {
  //       expect(contains).to.be.true;
  //       expect(storedCollection.length).to.be.equal(2);
  //
  //       storedCollection.destroy()
  //         .then(() => {
  //           storedCollection.has(sample)
  //             .then((finalContains) => {
  //               expect(finalContains).to.be.false;
  //               done();
  //             });
  //         });
  //     });
  // });
  //
  // it('should remove', (done) => {
  //   const sample = new Sample();
  //
  //   storedCollection.destroy()
  //     .then(() => storedCollection.set(sample))
  //     .then(() => storedCollection.has(sample))
  //     .then((contains) => {
  //       expect(contains).to.be.true;
  //       return storedCollection.remove(sample);
  //     })
  //     .then(() => storedCollection.has(sample))
  //     .then((finalContains) => {
  //       expect(finalContains).to.be.false;
  //       done();
  //     });
  // });
  //

  //
  // it('should return error if no id or cid has been passed', (done) => {
  //   storedCollection.set(12345).catch((err) => {
  //     expect(err).to.be.an('object');
  //     done();
  //   });
  // });
  //
  // it('should locally set get has', (done) => {
  //   const item = {
  //     cid: helpers.getNewUUID(),
  //   };
  //
  //   storedCollection.set(item)
  //     .then(() => storedCollection.get(item))
  //     .then((data) => {
  //       expect(data instanceof storedCollection.model).to.be.true;
  //       expect(data.cid).to.be.equal(item.cid);
  //
  //       return storedCollection.has(item);
  //     })
  //     .then((contains) => {
  //       expect(contains).to.be.true;
  //       done();
  //     });
  // });
  //
  // it('should return promises', (done) => {
  //   const item = {
  //     cid: helpers.getNewUUID(),
  //   };
  //
  //   storedCollection.set(item)
  //     .then(() => {
  //       storedCollection.get(item)
  //         .then((data) => {
  //           expect(data instanceof storedCollection.model).to.be.true;
  //           expect(data.cid).to.be.equal(item.cid);
  //           storedCollection.has(item)
  //             .then((contains) => {
  //               expect(contains).to.be.true;
  //               done();
  //             });
  //         });
  //     });
  // });
  //
  // it('should size', (done) => {
  //   storedCollection.size()
  //     .then((size) => {
  //       expect(size).to.be.equal(0);
  //       return storedCollection.set({ cid: helpers.getNewUUID() });
  //     })
  //     .then(() => storedCollection.size())
  //     .then((newSize) => {
  //       expect(newSize).to.be.equal(1);
  //       return storedCollection.destroy();
  //     })
  //     .then(() => storedCollection.size())
  //     .then((finalSize) => {
  //       expect(finalSize).to.be.equal(0);
  //       done();
  //     });
  // });
  //
  // it('should pass error object to on database error', (done) => {
  //   // on WebSQL+LocalForage this does not generate an error
  //   if (window.navigator.userAgent.search('Safari')) {
  //     done();
  //     return;
  //   }
  //
  //   const item = {
  //     cid: helpers.getNewUUID(),
  //     corruptedAttribute: () => {
  //     },
  //   };
  //
  //   storedCollection.set(item).catch((setErr) => {
  //     expect(setErr).to.be.not.null;
  //     done();
  //   });
  // });
});

let storedCollection;
//
// describe('Saving/destroying propagation', () => {
//   const store = new Store();
//
//   before((done) => {
//     storedCollection = new Morel.Collection(null, { store });
//     storedCollection.destroy().then(() => done());
//   });
//
//   beforeEach(() => {
//     storedCollection = new Morel.Collection(null, { store });
//   });
//
//   afterEach((done) => {
//     storedCollection.destroy().then(() => done());
//   });
//
//   describe('Media', () => {
//     it('should save sample on media save', (done) => {
//       const media = new Media();
//       const occurrence = new Occurrence(null, {
//         media: [media],
//       });
//       const sample = new Sample(null, {
//         occurrences: [occurrence],
//       });
//
//       // add sample to storedCollection
//       storedCollection.set(sample)
//         .then(() => {
//           expect(storedCollection.length).to.be.equal(1);
//
//           // update the media and save it - the save should be permenant
//           media.set('data', '1234');
//           const req = media.save().then(() => {
//             const newCollection = new Morel.Collection(null, { store });
//
//             expect(newCollection.length).to.be.equal(1);
//
//             const occurrenceFromDB = newCollection.at(0).getOccurrence();
//             const imageFromDB = occurrenceFromDB.media.at(0);
//
//             // check if change to media is permenant
//             expect(imageFromDB.get('data')).to.be.equal('1234');
//             done();
//           });
//           expect(req).to.be.an.instanceof(Promise);
//         })
//         .catch((err) => {
//           if (err) throw err.message;
//         });
//     });
//
//     it('should save sample on media destroy', (done) => {
//       const media = new Media();
//       const occurrence = new Occurrence(null, {
//         media: [media],
//       });
//       const sample = new Sample(null, {
//         occurrences: [occurrence],
//       });
//
//       // add sample to storedCollection
//       storedCollection.set(sample).then(() => {
//         expect(storedCollection.length).to.be.equal(1);
//
//         media.destroy().then(() => {
//           const newCollection = new Morel.Collection(null, { store });
//           expect(newCollection.length).to.be.equal(1);
//
//           const occurrenceFromDB = newCollection.at(0).getOccurrence();
//
//           // check if change to media is permenant
//           expect(occurrenceFromDB.media.length).to.be.equal(0);
//           done();
//         });
//       });
//     });
//   });
// //
// //   describe('Sample', () => {
// //     it('destroys the media on sample destroy', (done) => {
// //       const media = new Media();
// //       const occurrence = new Occurrence(null, {
// //         media: [media],
// //       });
// //       const sample = new Sample(null, {
// //         occurrences: [occurrence],
// //       });
// //
// //       // add sample to storedCollection
// //       storedCollection.set(sample).then(() => {
// //         sinon.spy(media, 'destroy');
// //
// //         sample.destroy().then(() => {
// //           expect(media.destroy.calledOnce).to.be.true;
// //           media.destroy.restore();
// //           done();
// //         });
// //       });
// //     });
// //   });
// //
// //   describe('Sync All', () => {
// //     let server;
// //
// //     function generateSampleResponse(sample) {
// //       server.respondWith(
// //         'POST',
// //         SAMPLE_POST_URL,
// //         serverResponses('OK', {
// //           cid: sample.cid,
// //           occurrence_cid: sample.getOccurrence().cid,
// //         }),
// //       );
// //     }
// //
// //     before((done) => {
// //       server = sinon.fakeServer.create();
// //       server.respondImmediately = true;
// //       storedCollection.destroy().then(() => done());
// //     });
// //
// //     beforeEach(() => {
// //       sinon.spy(storedCollection, 'sync');
// //       sinon.spy(Morel.Collection.prototype, 'post');
// //     });
// //
// //     after((done) => {
// //       server.restore();
// //       storedCollection.destroy().then(() => done());
// //     });
// //
// //     afterEach((done) => {
// //       Morel.Collection.prototype.post.restore();
// //       storedCollection.sync.restore();
// //       storedCollection.destroy().then(() => done());
// //     });
// //
// //
// //     it('should return a promise', () => {
// //       const promise = storedCollection.syncAll();
// //       expect(promise.then).to.be.a.function;
// //     });
// //
// //     it('should post all', (done) => {
// //       // check if storedCollection is empty
// //       expect(storedCollection.length).to.be.equal(0);
// //
// //       // add two valid samples
// //       const sample = getRandomSample();
// //       const sample2 = getRandomSample();
// //
// //       generateSampleResponse(sample);
// //
// //       // delete occurrences for the sample to become invalid to sync
// //       _.each(_.clone(sample2.occurrences.models), (model) => {
// //         model.destroy({ noSave: true });
// //       });
// //
// //       Promise.all([sample.save(), sample2.save()])
// //         .then(() => {
// //           expect(storedCollection.length).to.be.equal(2);
// //           // synchronise storedCollection
// //           return storedCollection.syncAll();
// //         })
// //         .then(() => {
// //           expect(storedCollection.sync.calledOnce).to.be.true;
// //
// //           // check sample status
// //           storedCollection.each((model) => {
// //             const status = model.getSyncStatus();
// //             if (model.cid === sample2.cid) {
// //               // invalid record (without occurrences)
// //               // should not be synced
// //               expect(status).to.be.equal(Morel.LOCAL);
// //             } else {
// //               expect(status).to.be.equal(Morel.SYNCED);
// //             }
// //           });
// //           done();
// //         });
// //     });
// //
// //     it('should not double sync all', (done) => {
// //       // add two valid samples
// //       const sample = getRandomSample();
// //
// //       generateSampleResponse(sample);
// //       Promise.all([sample.save()])
// //         .then(() => {
// //           // synchronise storedCollection twice
// //           Promise.all([storedCollection.syncAll(), storedCollection.syncAll()])
// //             .then(() => {
// //               expect(storedCollection.sync.callCount).to.be.equal(2);
// //               expect(Morel.Collection.prototype.post.calledOnce).to.be.true;
// //               done();
// //             });
// //         });
// //     });
// //   });
// });
//
