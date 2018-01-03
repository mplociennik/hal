<?php

namespace AppBundle\DependencyInjection;


use AppBundle\Entity\Language;
use AppBundle\Entity\SpeechCommand;
use AppBundle\Entity\WsMessage;
use AppBundle\Request\SpeechCommandRequest;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManager;

class SpeechCommandService
{
	/**
	 * @var EntityManager
	 */
	private $em;

	public function __construct(EntityManager $entityManager)
	{
		$this->em = $entityManager;
	}

	/**
	 * @param SpeechCommandRequest $speechCommandRequest
	 * @return SpeechCommand
	 * @throws \Doctrine\ORM\OptimisticLockException
	 */
	public function createSpeechCommand(SpeechCommandRequest $speechCommandRequest): SpeechCommand
	{
		$speechCommand = new SpeechCommand();
		$speechCommand->setCommand($speechCommandRequest->command);
		$language = $this->em->getRepository(Language::class)->find($speechCommandRequest->languageId);
		$speechCommand->setLanguage($language);
		$wsMessagesCollection = $this->prepareWsMessagesCollection($speechCommandRequest->wsMessages);
		$speechCommand->setWsMessages($wsMessagesCollection);
		$speechCommand->setCreatedAt(new \DateTime());
		$speechCommand->setUpdatedAt(new \DateTime());
		$this->em->persist($speechCommand);
		$this->em->flush();

		return $speechCommand;
	}

	/**
	 * @param array $wsMessages
	 * @return ArrayCollection
	 */
	private function prepareWsMessagesCollection(array $wsMessages): ArrayCollection
	{
		$wsMessagesCollection = new ArrayCollection();

		foreach ($wsMessages as $wsMessage) {
			$wsMessageObj = $this->prepareWsMessage($wsMessage);
			$wsMessagesCollection->add($wsMessageObj);
		}

		return $wsMessagesCollection;
	}

	/**
	 * @param string $value
	 * @return WsMessage
	 */
	private function prepareWsMessage(string $value): WsMessage
	{
		$wsMessage = new WsMessage();
		$wsMessage->setValue($value);
		$wsMessage->setCreatedAt(new \DateTime());
		$wsMessage->setUpdatedAt(new \DateTime());

		return $wsMessage;
	}
}