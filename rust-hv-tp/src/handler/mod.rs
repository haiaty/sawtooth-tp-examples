//mod game;
//mod payload;
//mod state;

//reference:https://github.com/hyperledger/sawtooth-sdk-rust/blob/master/examples/xo_rust/src/handler/mod.rs

//use crate::handler::game::Game;
//use crate::handler::payload::XoPayload;
//use crate::handler::state::{get_xo_prefix, XoState};

use crypto::digest::Digest;
use crypto::sha2::Sha512;

use sawtooth_sdk::messages::processor::TpProcessRequest;
use sawtooth_sdk::processor::handler::TransactionContext;
use sawtooth_sdk::processor::handler::{ApplyError,TransactionHandler};


pub struct HvTransactionHandler {
    family_name: String,
    family_versions: Vec<String>,
    namespaces: Vec<String>,
}

impl HvTransactionHandler {
    pub fn new() -> HvTransactionHandler {
        HvTransactionHandler {
            family_name: "hv_rust_tp".into(),
            family_versions: vec!["1.0".into()],
            namespaces: vec![get_prefix()],
        }
    }
}

impl TransactionHandler for HvTransactionHandler {
    fn family_name(&self) -> String {
        self.family_name.clone()
    }

    fn family_versions(&self) -> Vec<String> {
        self.family_versions.clone()
    }

    fn namespaces(&self) -> Vec<String> {
        self.namespaces.clone()
    }

    fn apply(
        &self,
        request: &TpProcessRequest,
        context: &mut dyn TransactionContext,
    ) -> Result<(), ApplyError> {



        let signer = request.get_header().get_signer_public_key();

        info!(
            "ok inside tp handler"
        );


        /*let payload = XoPayload::new(request.get_payload())?;

        let mut state = XoState::new(context);

        info!(
            "Payload: {} {} {}",
            payload.get_name(),
            payload.get_action(),
            payload.get_space(),
        );

        let game = state.get_game(payload.get_name().as_str())?;

        match payload.get_action().as_str() {
            "delete" => {
                if game.is_none() {
                    return Err(ApplyError::InvalidTransaction(String::from(
                        "Invalid action: game does not exist",
                    )));
                }
                state.delete_game(payload.get_name().as_str())?;
            }
            "create" => {
                if game.is_none() {
                    let game = Game::new(payload.get_name());
                    state.set_game(payload.get_name().as_str(), game)?;
                    info!("Created game: {}", payload.get_name().as_str());
                } else {
                    return Err(ApplyError::InvalidTransaction(String::from(
                        "Invalid action: Game already exists",
                    )));
                }
            }
            "take" => {
                if let Some(mut g) = game {
                    match g.get_state().as_str() {
                        "P1-WIN" | "P2-WIN" | "TIE" => {
                            return Err(ApplyError::InvalidTransaction(String::from(
                                "Invalid action: Game has ended",
                            )));
                        }
                        "P1-NEXT" => {
                            let p1 = g.get_player1();
                            if !p1.is_empty() && p1.as_str() != signer {
                                return Err(ApplyError::InvalidTransaction(String::from(
                                    "Not player 2's turn",
                                )));
                            }
                        }
                        "P2-NEXT" => {
                            let p2 = g.get_player2();
                            if !p2.is_empty() && p2.as_str() != signer {
                                return Err(ApplyError::InvalidTransaction(String::from(
                                    "Not player 1's turn",
                                )));
                            }
                        }
                        _ => {
                            return Err(ApplyError::InvalidTransaction(String::from(
                                "Invalid state",
                            )));
                        }
                    }

                    let board_chars: Vec<char> = g.get_board().chars().collect();
                    if board_chars[payload.get_space() - 1] != '-' {
                        return Err(ApplyError::InvalidTransaction(format!(
                            "Space {} is already taken",
                            payload.get_space()
                        )));
                    }

                    if g.get_player1().is_empty() {
                        g.set_player1(signer);
                    } else if g.get_player2().is_empty() {
                        g.set_player2(signer)
                    }

                    g.mark_space(payload.get_space())?;
                    g.update_state()?;

                    g.display();

                    state.set_game(payload.get_name().as_str(), g)?;
                } else {
                    return Err(ApplyError::InvalidTransaction(String::from(
                        "Invalid action: Take requires an existing game",
                    )));
                }
            }
            other_action => {
                return Err(ApplyError::InvalidTransaction(format!(
                    "Invalid action: '{}'",
                    other_action
                )));
            }
        }*/

        Ok(())
    }
}

/*
Get the namespace prefix for the addresses
*/
pub fn get_prefix() -> String {
    let mut sha = Sha512::new();
    sha.input_str("hv_tp");
    sha.result_str()[..6].to_string()
}

