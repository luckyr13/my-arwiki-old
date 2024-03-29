import { 
	readContract, interactWrite,
	createContract, interactRead
} from 'smartweave';
import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { ArweaveService } from '../arweave.service';
import { map } from 'rxjs/operators';
import { JWKInterface } from 'arweave/node/lib/wallet';

@Injectable({
  providedIn: 'root'
})
export class ArwikiTokenContract
{
	private _contractAddress: string = 'l6lXn5yYIJ0fHaaxGgeuPAy5l0UgmDnEGoYR4J3CCMs';
	private _state: any = {};
	private _adminList: string[] = [];

	get contractAddress() {
		return this._contractAddress;
	}

	constructor(private _arweave: ArweaveService) {
	}

	deployNewContract() {
		
	}

	/*
	*	@dev Get full contract state as Observable
	*/
	getState(reload: boolean = false): Observable<any> {
		const obs = new Observable<any>((subscriber) => {
			if (Object.keys(this._state).length > 0 && !reload) {
				subscriber.next(this._state);
				subscriber.complete();
			} else {
				readContract(this._arweave.arweave, this._contractAddress)
					.then((state: any) => {
						this._state = state;
						this._adminList = Object.keys(state.roles).filter((address) => {
							return state.roles[address].toUpperCase() === 'MODERATOR';
						});

						subscriber.next(state);
						subscriber.complete();
					}).catch((error) => {
						subscriber.error(error);
					});
			}

		});

		return obs;
	}

	/*
	*	@dev Get only the admin list from full state contract
	*/
	getAdminList(): Observable<string[]> {
		return this.getState().pipe(
			map((_state: any) => {
				console.log(_state)
				this._adminList = Object.keys(_state.roles).filter((address) => {
					return _state.roles[address].toUpperCase() === 'MODERATOR';
				});

				return this._adminList;
			})
		);
	}

	/*
	*	@dev Get only the admin list from full state contract
	*/
	isAdmin(address: string): Observable<boolean> {
		return this.getAdminList().pipe(
			map( (admin_list: string[]) => {
				return Array.prototype.indexOf.call(admin_list, address) >= 0; 
			})
		);
	}

	/*
	*	@dev Execute read function on PST contract
	*/
	getBalance(address: string, wallet: JWKInterface): Observable<any> {
		const input = {
			function: 'balanceDetail',
			target: address
		}
		return from(interactRead(
			this._arweave.arweave,
			wallet,
			this._contractAddress,
			input)
		);
	}

	/*
  * @dev All pages needs to be validated first 
  * to be listed on the Arwiki. Validations are special TXs
  * with custom tags (Arwiki-Type: Validation)
  */
  async approvePage(
    _pageId: string,
    _author: string,
    _slug: string,
    _category: string,
    _langCode: string,
    _pageValue: number,
    _privateKey: any,
    _arwikiVersion: string
  ) {
    const jwk = _privateKey;
    const tags = [
    	{name: 'Service', value: 'ArWiki'},
    	{name: 'Arwiki-Type', value: 'Validation'},
    	{name: 'Arwiki-Page-Id', value: _pageId},
    	{name: 'Arwiki-Page-Slug', value: _slug},
    	{name: 'Arwiki-Page-Category', value: _category},
    	{name: 'Arwiki-Page-Lang', value: _langCode},
    	{name: 'Arwiki-Page-Value', value: `${_pageValue}`},
    	{name: 'Arwiki-Version', value: _arwikiVersion},
    ];
    const input = {
    	function: 'approvePage',
    	author: _author,
    	pageTX: _pageId,
    	pageValue: `${_pageValue}`
    };
    const tx = await interactWrite(
      this._arweave.arweave,
      jwk,
      this._contractAddress,
      input,
      tags
    );
    return tx;
  }

  /*
	*	@dev Get only the settings property from full state contract
	*/
	getSettings(): Observable<any> {
		return this.getState().pipe(
			map((_state: any) => {
				const settings = new Map(_state.settings);
				return settings;
			})
		);
	}

}