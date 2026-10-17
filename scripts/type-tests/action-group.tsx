import {ActionGroup,Button} from '@arlab/ui';
export const discreetActions=<ActionGroup equalWidth label="Record actions" overflowLabel="More record actions" overflowActions={[{label:'Duplicate',onSelect:()=>{}},{separator:true},{label:'Remove',danger:true,onSelect:()=>{}}]}><Button>Save</Button><Button>Preview</Button></ActionGroup>;
// @ts-expect-error Action items keep the shared menu's required label contract.
const invalid=<ActionGroup overflowActions={[{onSelect:()=>{}}]}>Save</ActionGroup>;
void invalid;
