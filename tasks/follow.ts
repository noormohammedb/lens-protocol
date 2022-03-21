/* eslint-disable no-empty-pattern */
import { task } from 'hardhat/config';
import { FollowNFT__factory, LensHub__factory } from '../typechain-types';
import { getAddrs, initEnv, waitForTx } from './helpers/utils';

task('follow', 'Follows A Profile').setAction(async ({}, hre) => {
  const [, , userSig] = await initEnv(hre);
  const addrs = getAddrs();
  const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], userSig);

  await waitForTx(lensHub.follow([1], [[]]));

  const followNFTAddr = await lensHub.getFollowNFT(1);
  const followNFT = FollowNFT__factory.connect(followNFTAddr, userSig);

  const totalSupply = await followNFT.totalSupply();
  const ownerOf = await followNFT.ownerOf(1);

  console.log(`Follow NFT total supply (should be 1): ${totalSupply}`);
  console.log(
    `Follow NFT owner of ID 1: ${ownerOf}, user address (should be the same): ${userSig.address}`
  );
});
