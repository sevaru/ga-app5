import { USER_REQUEST_EVENTS } from './USER_REQUEST_EVENTS';
import { createGA } from './createGA';
import DarwinEvolution from '../../evolution/providers/DarwinEvolution';

export function createOnMessageEvolution(plugins) {
    return createOnMessageBase({
        executorProvider: (evolutionName) => plugins[evolutionName].executor
    });
}

export function createOnMessageSimple() {
    return createOnMessageBase({ executor: DarwinEvolution.executor });
}

/**
 * 
 * @param {{ executor: Function, executorProvider: (evolutionName: string) => Function }} param0
 */
function createOnMessageBase({ executor, executorProvider }) {
    let gaInstance;
    return (event/*: { data: { action: 'start' | 'stop' | 'pause', data: any } } */) => { // eslint-disable-line
        const { data: { options, reference, migrants, id, evolutionName } = {}, action } = event.data;

        console.log(event);

        switch (action) {
            case USER_REQUEST_EVENTS.START:
                if (executor) {
                    gaInstance = createGA(options, reference, id, executor, evolutionName);
                } else if (executorProvider) {
                    gaInstance = createGA(options, reference, id, executorProvider(evolutionName), evolutionName);
                }
                break;

            case USER_REQUEST_EVENTS.STOP:
                gaInstance.stop();
                // TODO: creepy way to let websocket send message on onDone back and only than close socket; 
                setTimeout(close, 100);
                break;

            case USER_REQUEST_EVENTS.PAUSE:
                gaInstance.pause();
                break;

            case USER_REQUEST_EVENTS.RESUME:
                gaInstance.resume();
                break;

            case 'migrate':
                if (migrants && gaInstance.migrate) {
                    gaInstance.migrate(migrants);
                }
                break;

            default:
                throw `Unknown action ${action}`;
        }
    };
}