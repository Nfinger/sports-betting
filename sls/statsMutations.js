module.exports.updateOrCreateTouchdowns = `
mutation(
  $id: ID!
  $statsId: ID!
  $pass: Int
  $rush: Int
  $totalReturn: Int
  $total: Int
  $fumbleReturn: Int
  $intReturn: Int
  $kickReturn: Int
  $puntReturn: Int
  $other: Int
) {
  updateOrCreateTouchdowns(update: {
    id: $id
    statsId: $statsId
	pass: $pass
    rush: $rush
    totalReturn: $totalReturn
    total: $total
    fumbleReturn: $fumbleReturn
    intReturn: $intReturn
    kickReturn: $kickReturn
    puntReturn: $puntReturn
    other: $other
  }, create: {
    statsId: $statsId
	pass: $pass
    rush: $rush
    totalReturn: $totalReturn
    total: $total
    fumbleReturn: $fumbleReturn
    intReturn: $intReturn
    kickReturn: $kickReturn
    puntReturn: $puntReturn
    other: $other
  }) {
    id
  }
}
`;

module.exports.updateOrCreateRushing = `
    mutation (
        $id: ID!
        $statsId: ID!
        $avgYards: Float
        $attempts: Int
        $touchdowns: Int
        $tlost: Int
        $tlostYards: Int
        $yards: Int
        $longest: Int
        $longestTouchdown: Int
        $redzoneAttempts: Int
        $brokenTackles: Int
        $kneelDowns: Int
        $scrambles: Int
        $yardsAfterContact: Int
    ) {
        updateOrCreateRushing(
            create: {
                statsId: $statsId
                avgYards: $avgYards
                attempts: $attempts
                touchdowns: $touchdowns
                tlost: $tlost
                tlostYards: $tlostYards
                yards: $yards
                longest: $longest
                longestTouchdown: $longestTouchdown
                redzoneAttempts: $redzoneAttempts
                brokenTackles: $brokenTackles
                kneelDowns: $kneelDowns
                scrambles: $scrambles
                yardsAfterContact: $yardsAfterContact
            },
            update: {
                id: $id
                avgYards: $avgYards
                attempts: $attempts
                touchdowns: $touchdowns
                tlost: $tlost
                tlostYards: $tlostYards
                yards: $yards
                longest: $longest
                longestTouchdown: $longestTouchdown
                redzoneAttempts: $redzoneAttempts
                brokenTackles: $brokenTackles
                kneelDowns: $kneelDowns
                scrambles: $scrambles
                yardsAfterContact: $yardsAfterContact
            }
        ) {
            id
        }
    }
`

module.exports.updateOrCreateReceiving = `
    mutation(
        $id: ID!
        $statsId: ID!
        $targets: Float
        $receptions: Float
        $avgYards: Float
        $yards: Float
        $touchdowns: Float
        $yardsAfterCatch: Float
        $longest: Float
        $longestTouchdown: Float
        $redzoneTargets: Float
        $airYards: Float
        $brokenTackles: Float
        $droppedPasses: Float
        $catchablePasses: Float
        $yardsAfterContact: Float
    ) {
        updateOrCreateReceiving(
            create: {
                statsId: $statsId
                targets: $targets
                receptions: $receptions
                avgYards: $avgYards
                yards: $yards
                touchdowns: $touchdowns
                yardsAfterCatch: $yardsAfterCatch
                longest: $longest
                longestTouchdown: $longestTouchdown
                redzoneTargets: $redzoneTargets
                airYards: $airYards
                brokenTackles: $brokenTackles
                droppedPasses: $droppedPasses
                catchablePasses: $catchablePasses
                yardsAfterContact: $yardsAfterContact
            },
            update: {
                id: $id
                targets: $targets
                receptions: $receptions
                avgYards: $avgYards
                yards: $yards
                touchdowns: $touchdowns
                yardsAfterCatch: $yardsAfterCatch
                longest: $longest
                longestTouchdown: $longestTouchdown
                redzoneTargets: $redzoneTargets
                airYards: $airYards
                brokenTackles: $brokenTackles
                droppedPasses: $droppedPasses
                catchablePasses: $catchablePasses
                yardsAfterContact: $yardsAfterContact
            }
        ) {
            id
        }
    }
`

module.exports.updateOrCreatePunts = `
    mutation(
        $id: ID!
        $statsId: ID!
        $attempts: Float
        $yards: Float
        $netYards: Float
        $blocked: Float
        $touchbacks: Float
        $inside20: Float
        $returnYards: Float
        $avgNetYards: Float
        $avgYards: Float
        $longest: Float
        $hangTime: Float
        $avgHangTime: Float
    ) {
        updateOrCreatePunts(
            create: {
                statsId: $statsId
                attempts: $attempts
                yards: $yards
                netYards: $netYards
                blocked: $blocked
                touchbacks: $touchbacks
                inside20: $inside20
                returnYards: $returnYards
                avgNetYards: $avgNetYards
                avgYards: $avgYards
                longest: $longest
                hangTime: $hangTime
                avgHangTime: $avgHangTime
            },
            update: {
                id: $id
                attempts: $attempts
                yards: $yards
                netYards: $netYards
                blocked: $blocked
                touchbacks: $touchbacks
                inside20: $inside20
                returnYards: $returnYards
                avgNetYards: $avgNetYards
                avgYards: $avgYards
                longest: $longest
                hangTime: $hangTime
                avgHangTime: $avgHangTime
            }
        ) {
            id
        }
    }
`

module.exports.updateOrCreatePuntReturns = `
    mutation(
        $id: ID!
        $statsId: ID!
        $avgYards: Float
        $returns: Float
        $yards: Float
        $longest: Float
        $touchdowns: Float
        $longestTouchdown: Float
        $faircatches: Float
    ) {
        updateOrCreatePuntReturns(
            create: {
                statsId: $statsId
                avgYards: $avgYards
                returns: $returns
                yards: $yards
                longest: $longest
                touchdowns: $touchdowns
                longestTouchdown: $longestTouchdown
                faircatches: $faircatches
            },
            update: {
                id: $id
                avgYards: $avgYards
                returns: $returns
                yards: $yards
                longest: $longest
                touchdowns: $touchdowns
                longestTouchdown: $longestTouchdown
                faircatches: $faircatches
            }
        ) {
            id
        }
    }
`

module.exports.updateOrCreatePenalties = `
    mutation(
        $id: ID!
        $statsId: ID!
        $penalties: Float
        $yards: Float
    ) {
        updateOrCreatePenalties(
            create: {
                statsId: $statsId
                penalties: $penalties
                yards: $yards
            },
            update: {
                id: $id
                penalties: $penalties
                yards: $yards
            }
        ) {
            id
        }
    }
`

module.exports.updateOrCreatePassing = `
    mutation(
        $id: ID!
        $statsId: ID!
        $attempts: Float
        $completions: Float
        $cmpPct: Float
        $interceptions: Float
        $sackYards: Float
        $rating: Float
        $touchdowns: Float
        $avgYards: Float
        $sacks: Float
        $longest: Float
        $longestTouchdown: Float
        $airYards: Float
        $redzoneAttempts: Float
        $netYards: Float
        $yards: Float
        $grossYards: Float
        $throwAways: Float
        $poorThrows: Float
        $defendedPasses: Float
        $droppedPasses: Float
        $spikes: Float
        $blitzes: Float
        $hurries: Float
        $knockdowns: Float
        $pocketTime: Float
    ) {
        updateOrCreatePassing(
            create: {
                statsId: $statsId
                attempts: $attempts
                completions: $completions
                cmpPct: $cmpPct
                interceptions: $interceptions
                sackYards: $sackYards
                rating: $rating
                touchdowns: $touchdowns
                avgYards: $avgYards
                sacks: $sacks
                longest: $longest
                longestTouchdown: $longestTouchdown
                airYards: $airYards
                redzoneAttempts: $redzoneAttempts
                netYards: $netYards
                yards: $yards
                grossYards: $grossYards
                throwAways: $throwAways
                poorThrows: $poorThrows
                defendedPasses: $defendedPasses
                droppedPasses: $droppedPasses
                spikes: $spikes
                blitzes: $blitzes
                hurries: $hurries
                knockdowns: $knockdowns
                pocketTime: $pocketTime
            },
            update: {
                id: $id
                attempts: $attempts
                completions: $completions
                cmpPct: $cmpPct
                interceptions: $interceptions
                sackYards: $sackYards
                rating: $rating
                touchdowns: $touchdowns
                avgYards: $avgYards
                sacks: $sacks
                longest: $longest
                longestTouchdown: $longestTouchdown
                airYards: $airYards
                redzoneAttempts: $redzoneAttempts
                netYards: $netYards
                yards: $yards
                grossYards: $grossYards
                throwAways: $throwAways
                poorThrows: $poorThrows
                defendedPasses: $defendedPasses
                droppedPasses: $droppedPasses
                spikes: $spikes
                blitzes: $blitzes
                hurries: $hurries
                knockdowns: $knockdowns
                pocketTime: $pocketTime
            }
        ) {
            id
        }
    }
`

module.exports.updateOrCreateKickoffs = `
    mutation(
        $id: ID!
        $statsId: ID!
        $endzone: Float
        $inside20: Float
        $returnYards: Float
        $returned: Float
        $touchbacks: Float
        $yards: Float
        $outOfBounds: Float
        $kickoffs: Float
        $onsideAttempts: Float
        $onsideSuccesses: Float
        $squibKicks: Float
    ) {
        updateOrCreateKickoffs(
            create: {
                statsId: $statsId
                endzone: $endzone
                inside20: $inside20
                returnYards: $returnYards
                returned: $returned
                touchbacks: $touchbacks
                yards: $yards
                outOfBounds: $outOfBounds
                kickoffs: $kickoffs
                onsideAttempts: $onsideAttempts
                onsideSuccesses: $onsideSuccesses
                squibKicks: $squibKicks
            },
            update: {
                id: $id
                endzone: $endzone
                inside20: $inside20
                returnYards: $returnYards
                returned: $returned
                touchbacks: $touchbacks
                yards: $yards
                outOfBounds: $outOfBounds
                kickoffs: $kickoffs
                onsideAttempts: $onsideAttempts
                onsideSuccesses: $onsideSuccesses
                squibKicks: $squibKicks
            }
        ) {
            id
        }
    }
`

  
module.exports.updateOrCreateKickReturns = `
    mutation(
        $id: ID!
        $statsId: ID!
        $avgYards: Float
        $yards: Float
        $longest: Float
        $touchdowns: Float
        $longestTouchdown: Float
        $faircatches: Float
        $returns: Float
    ) {
        updateOrCreateKickReturns(
            create: {
                statsId: $statsId
                avgYards: $avgYards
                yards: $yards
                longest: $longest
                touchdowns: $touchdowns
                longestTouchdown: $longestTouchdown
                faircatches: $faircatches
                returns: $returns
            },
            update: {
                id: $id
                avgYards: $avgYards
                yards: $yards
                longest: $longest
                touchdowns: $touchdowns
                longestTouchdown: $longestTouchdown
                faircatches: $faircatches
                returns: $returns
            }
        ) {
            id
        }
    }
`


module.exports.updateOrCreateInterceptions = `
    mutation(
        $id: ID!
        $statsId: ID!
        $returnYards: Float
        $returned: Float
        $interceptions: Float
    ) {
        updateOrCreateInterceptions(
            create: {
                statsId: $statsId
                returnYards: $returnYards
                returned: $returned
                interceptions: $interceptions
            },
            update: {
                id: $id
                returnYards: $returnYards
                returned: $returned
                interceptions: $interceptions
            }
        ) {
            id
        }
    }
`


module.exports.updateOrCreateInterceptionReturns = `
    mutation(
        $id: ID!
        $statsId: ID!
        $avgYards: Float
        $yards: Float
        $longest: Float
        $touchdowns: Float
        $longestTouchdown: Float
        $returns: Float
    ) {
        updateOrCreateInterceptionReturns(
            create: {
                statsId: $statsId
                avgYards: $avgYards
                yards: $yards
                longest: $longest
                touchdowns: $touchdowns
                longestTouchdown: $longestTouchdown
                returns: $returns
            },
            update: {
                id: $id
                avgYards: $avgYards
                yards: $yards
                longest: $longest
                touchdowns: $touchdowns
                longestTouchdown: $longestTouchdown
                returns: $returns
            }
        ) {
            id
        }
    }
`


module.exports.updateOrCreateFumbles = `
    mutation(
        $id: ID!
        $statsId: ID!
        $fumbles: Int
        $lostFumbles: Int
        $ownRec: Int
        $ownRecYards: Int
        $oppRec: Int
        $oppRecYards: Int
        $outOfBounds: Int
        $forcedFumbles: Int
        $ownRecTds: Int
        $oppRecTds: Int
        $ezRecTds: Int
    ) {
        updateOrCreateFumbles(
            create: {
                statsId: $statsId
                fumbles: $fumbles
                lostFumbles: $lostFumbles
                ownRec: $ownRec
                ownRecYards: $ownRecYards
                oppRec: $oppRec
                oppRecYards: $oppRecYards
                outOfBounds: $outOfBounds
                forcedFumbles: $forcedFumbles
                ownRecTds: $ownRecTds
                oppRecTds: $oppRecTds
                ezRecTds: $ezRecTds
            },
            update: {
                id: $id
                fumbles: $fumbles
                lostFumbles: $lostFumbles
                ownRec: $ownRec
                ownRecYards: $ownRecYards
                oppRec: $oppRec
                oppRecYards: $oppRecYards
                outOfBounds: $outOfBounds
                forcedFumbles: $forcedFumbles
                ownRecTds: $ownRecTds
                oppRecTds: $oppRecTds
                ezRecTds: $ezRecTds
            }
        ) {
            id
        }
    }
`


module.exports.updateOrCreateFirstDowns = `
    mutation(
        $id: ID!
        $statsId: ID!
        $pass: Int
        $penalty: Int
        $rush: Int
        $total: Int
    ) {
        updateOrCreateFirstDowns(
            create: {
                statsId: $statsId
                pass: $pass
                penalty: $penalty
                rush: $rush
                total: $total
            },
            update: {
                id: $id
                pass: $pass
                penalty: $penalty
                rush: $rush
                total: $total
            }
        ) {
            id
        }
    }
`


module.exports.updateOrCreateFieldGoals = `
    mutation(
        $id: ID!
        $statsId: ID!
        $attempts: Float
        $made: Float
        $blocked: Float
        $yards: Float
        $avgYards: Float
        $longest: Float
    ) {
        updateOrCreateFieldGoals(
            create: {
                statsId: $statsId
                attempts: $attempts
                made: $made
                blocked: $blocked
                yards: $yards
                avgYards: $avgYards
                longest: $longest
            },
            update: {
                id: $id
                attempts: $attempts
                made: $made
                blocked: $blocked
                yards: $yards
                avgYards: $avgYards
                longest: $longest
            }
        ) {
            id
        }
    }
`


module.exports.updateOrCreateEfficiency = `
    mutation(
        $id: ID!
        $statsId: ID!
        $goaltogo: Float
        $redzone: Float
        $thirddown: Float
        $fourthdown: Float
    ) {
        updateOrCreateEfficiency(
            create: {
                statsId: $statsId
                goaltogo: $goaltogo
                redzone: $redzone
                thirddown: $thirddown
                fourthdown: $fourthdown
            },
            update: {
                id: $id
                goaltogo: $goaltogo
                redzone: $redzone
                thirddown: $thirddown
                fourthdown: $fourthdown
            }
        ) {
            id
        }
    }
`


module.exports.updateOrCreateDefense = `
    mutation(
        $id: ID!
        $statsId: ID!
        $tackles: Int
        $assists: Int
        $combined: Int
        $sacks: Int
        $sackYards: Int
        $interceptions: Int
        $passesDefended: Int
        $forcedFumbles: Int
        $fumbleRecoveries: Int
        $qbHits: Int
        $tloss: Int
        $tlossYards: Int
        $safeties: Int
        $spTackles: Int
        $spAssists: Int
        $spForcedFumbles: Int
        $spFumbleRecoveries: Int
        $spBlocks: Int
        $miscTackles: Int
        $miscAssists: Int
        $miscForcedFumbles: Int
        $miscFumbleRecoveries: Int
        $defTargets: Int
        $defComps: Int
        $blitzes: Int
        $hurries: Int
        $knockdowns: Int
        $missedTackles: Int
    ) {
        updateOrCreateDefense(
            create: {
                statsId: $statsId
                tackles: $tackles
                assists: $assists
                combined: $combined
                sacks: $sacks
                sackYards: $sackYards
                interceptions: $interceptions
                passesDefended: $passesDefended
                forcedFumbles: $forcedFumbles
                fumbleRecoveries: $fumbleRecoveries
                qbHits: $qbHits
                tloss: $tloss
                tlossYards: $tlossYards
                safeties: $safeties
                spTackles: $spTackles
                spAssists: $spAssists
                spForcedFumbles: $spForcedFumbles
                spFumbleRecoveries: $spFumbleRecoveries
                spBlocks: $spBlocks
                miscTackles: $miscTackles
                miscAssists: $miscAssists
                miscForcedFumbles: $miscForcedFumbles
                miscFumbleRecoveries: $miscFumbleRecoveries
                defTargets: $defTargets
                defComps: $defComps
                blitzes: $blitzes
                hurries: $hurries
                knockdowns: $knockdowns
                missedTackles: $missedTackles
            },
            update: {
                id: $id
                tackles: $tackles
                assists: $assists
                combined: $combined
                sacks: $sacks
                sackYards: $sackYards
                interceptions: $interceptions
                passesDefended: $passesDefended
                forcedFumbles: $forcedFumbles
                fumbleRecoveries: $fumbleRecoveries
                qbHits: $qbHits
                tloss: $tloss
                tlossYards: $tlossYards
                safeties: $safeties
                spTackles: $spTackles
                spAssists: $spAssists
                spForcedFumbles: $spForcedFumbles
                spFumbleRecoveries: $spFumbleRecoveries
                spBlocks: $spBlocks
                miscTackles: $miscTackles
                miscAssists: $miscAssists
                miscForcedFumbles: $miscForcedFumbles
                miscFumbleRecoveries: $miscFumbleRecoveries
                defTargets: $defTargets
                defComps: $defComps
                blitzes: $blitzes
                hurries: $hurries
                knockdowns: $knockdowns
                missedTackles: $missedTackles
            }
        ) {
            id
        }
    }
`
