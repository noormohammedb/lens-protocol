/* eslint-disable no-empty-pattern */
import { task } from 'hardhat/config';
import { LensHub__factory } from '../typechain-types';
import { CreateProfileDataStruct } from '../typechain-types/LensHub';
import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from './helpers/utils';

task('create-profile', 'create a profile').setAction(async ({}, hre) => {
  const [govSig, , userSig] = await initEnv(hre);
  const addrs = getAddrs();

  const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], govSig);
  await waitForTx(lensHub.whitelistProfileCreator(userSig.address, true));

  const inputStruct: CreateProfileDataStruct = {
    to: userSig.address,
    handle: 'loremipsum',
    imageURI:
      'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
    followModule: ZERO_ADDRESS,
    followModuleData: [],
    followNFTURI:
      'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
  };

  await waitForTx(lensHub.connect(userSig).createProfile(inputStruct));

  console.log(`Total supply (should be 1): ${await lensHub.totalSupply()}`);
  console.log(
    `Profile owner: ${await lensHub.ownerOf(1)}, user address (should be the same): ${
      userSig.address
    }`
  );

  console.log(
    `Profile ID by handle: ${await lensHub.getProfileIdByHandle(
      'loremipsum'
    )}, user address (should be same) : ${userSig.address}`
  );
});
