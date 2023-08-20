/* eslint-disable prettier/prettier */
import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text, divider } from '@metamask/snaps-ui';

type Person = {
  name: string;
  dob: string;
  nationality: string;
  voterId: string;
};

// eslint-disable-next-line jsdoc/require-jsdoc
async function getData(voterId: string): Promise<Person> {
  const data = await fetch(
    `https://people-db.onrender.com/getPerson/${voterId}`,
  );
  const dataJson: Person = await data.json();
  console.log(dataJson);
  return dataJson;
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  // @ts-ignore
  console.log('These are the params', request.params.voterId);
  switch (request.method) {
    case 'hello': // @ts-ignore
      return getData(request.params.voterId).then((data) => {
        console.log(data);
        if (data.voterId === undefined) {
          return snap.request({
            method: 'snap_dialog',
            params: {
              type: 'alert',
              content: panel([
                text(
                  // eslint-disable-next-line prefer-template -- string concat
                  'No Data Avaialble for the Voter Id ' +
                    request.params.voterId,
                ),
              ]),
            },
          });
        }
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: panel([
              text(`Hello, **${origin}**!`),
              divider(),
              text(`**Name**:           ${data.name}`),
              text(`**DOB**:            ${data.dob}`),
              text(`**Nationality**:    ${data.nationality}`),
              text(`**VoterId**:        ${data.voterId}`),
            ]),
          },
        });
      });
    default:
      throw new Error('Method not found.');
  }
};
