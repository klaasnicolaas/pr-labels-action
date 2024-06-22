import * as core from '@actions/core'
import { getPullRequestByNumber } from '../src/index'

jest.mock('@actions/core')
jest.mock('@actions/github')

const mockCore = core as jest.Mocked<typeof core>

describe('GitHub Action - getPullRequestByNumber', () => {
  it('should return pull request details', async () => {
    const mockOctokit = {
      rest: {
        pulls: {
          get: jest.fn().mockResolvedValue({ data: { number: 1 } }),
        },
      },
    }

    const pr = await getPullRequestByNumber(
      mockOctokit as any,
      'owner',
      'repo',
      1,
    )

    expect(pr).toEqual({ number: 1 })
  })

  it('should return undefined if pull request number is undefined', async () => {
    const pr = await getPullRequestByNumber(
      {} as any,
      'owner',
      'repo',
      undefined,
    )

    expect(pr).toBeUndefined()
    expect(mockCore.error).toHaveBeenCalledWith(
      'Error fetching pull request #undefined: Error: Pull request number is undefined',
    )
  })
})
