
extern crate sawtooth_sdk;

// this is the "smart contract" business logic
use mylib::handler::HvTransactionHandler;



use sawtooth_sdk::processor::TransactionProcessor;

#[macro_use]
extern crate log;

use std::process;

use log::LevelFilter;
use log4rs::append::console::ConsoleAppender;
use log4rs::config::{Appender, Config, Root};
use log4rs::encode::pattern::PatternEncoder;


fn main() {

    // just init logging to see in the console
    // what's going on
    init_logging();
  
    // the url of the validator.
    // be sure that it is reachable from your machine
    // NOTE: host.docker.internal is the name that is mapped to the host ip inside a docker container
    let endpoint = "tcp://host.docker.internal:4004";

    let handler = HvTransactionHandler::new();

    let mut processor = TransactionProcessor::new(endpoint);

    processor.add_handler(&handler);

    processor.start();
}

/**
Init of logging on console
*/
fn init_logging() {

    let stdout = ConsoleAppender::builder()
    .encoder(Box::new(PatternEncoder::new(
        "{h({l:5.5})} | {({M}:{L}):20.20} | {m}{n}",
    )))
    .build();

let config = match Config::builder()
    .appender(Appender::builder().build("stdout", Box::new(stdout)))
    .build(Root::builder().appender("stdout").build(LevelFilter::Trace))
{
    Ok(x) => x,
    Err(e) => {
        for err in e.errors().iter() {
            error!("Configuration error: {}", err.to_string());
        }
        process::exit(1);
    }
};

match log4rs::init_config(config) {
    Ok(_) => (),
    Err(e) => {
        error!("Configuration error: {}", e.to_string());
        process::exit(1);
    }
}

}