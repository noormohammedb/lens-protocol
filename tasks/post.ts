/* eslint-disable no-empty-pattern */
import { task } from 'hardhat/config';
import { LensHub__factory } from '../typechain-types';
import { PostDataStruct } from '../typechain-types/LensHub';
import { getAddrs, initEnv, waitForTx, ZERO_ADDRESS } from './helpers/utils';

task('post', 'Publish a post').setAction(async ({}, hre) => {
  const [govSig, , userSig] = await initEnv(hre);
  const addrs = getAddrs();

  const empCollModAddress = addrs['empty collect module'];
  const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], govSig);

  await waitForTx(lensHub.whitelistCollectModule(empCollModAddress, true));

  const inputStruct: PostDataStruct = {
    profileId: 1,
    contentURI:
      'https://ipfs.fleek.co/ipfs/plantghostplantghostplantghostplantghostplantghostplantghos',
    collectModule: empCollModAddress,
    collectModuleData: [],
    referenceModule: ZERO_ADDRESS,
    referenceModuleData: [],
  };

  await waitForTx(lensHub.connect(userSig).post(inputStruct));
  console.log(await lensHub.getPub(1, 1));
});
